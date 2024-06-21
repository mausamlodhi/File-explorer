import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPath: [],
  fileSystem: {
    name: 'root',
    type: 'folder',
    children: [
      {
        name: 'Doc',
        type: 'folder',
        children: [
          { name: 'file1.txt', type: 'file' },
          { name: 'file2.txt', type: 'file' },
          {
            name: 'Work',
            type: 'folder',
            children: [
              { name: 'project1.docx', type: 'file' },
              { name: 'project2.docx', type: 'file' },
            ],
          },
        ],
      },
      {
        name: 'Pictures',
        type: 'folder',
        children: [
          { name: 'photo1.jpg', type: 'file' },
          { name: 'photo2.png', type: 'file' },
        ],
      },
      {
        name: 'Music',
        type: 'folder',
        children: [
          { name: 'song1.mp3', type: 'file' },
          { name: 'song2.mp3', type: 'file' },
        ],
      },
      { name: 'New.txt', type: 'file' },
    ],
  },
};

const findFolder = (folder, path) => {
  let currentFolder = folder;
  path.forEach((p) => {
    currentFolder = currentFolder.children.find((child) => child.name === p);
  });
  return currentFolder;
};

const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState,
  reducers: {
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload;
    },
    createFolder: (state, action) => {
      const { path, folderName } = action.payload;
      if (!folderName) {
        alert('Folder name cannot be empty');
        return;
      }
      const folder = findFolder(state.fileSystem, path);
      if (folder.children.find((child) => child.name === folderName)) {
        alert('Folder already exists');
        return;
      }
      folder.children.push({ name: folderName, type: 'folder', children: [] });
    },
    renameItem: (state, action) => {
      const { path, oldName, newName } = action.payload;
      if (!newName) {
        alert('Name cannot be empty');
        return;
      }
      const folder = findFolder(state.fileSystem, path);
      const item = folder.children.find((child) => child.name === oldName);
      if (!item) {
        alert('Item not found');
        return;
      }
      item.name = newName;
    },
    deleteItem: (state, action) => {
      const { path, name } = action.payload;
      const folder = findFolder(state.fileSystem, path);
      const index = folder.children.findIndex((child) => child.name === name);
      if (index === -1) {
        alert('Item not found');
        return;
      }
      folder.children.splice(index, 1);
    },
  },
});

export const { setCurrentPath, createFolder, renameItem, deleteItem } = fileSystemSlice.actions;

export default fileSystemSlice.reducer;
