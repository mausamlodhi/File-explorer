import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPath, createFolder, renameItem, deleteItem } from '../features/fileSystemSlice';

const FileExplorer = () => {
  const fileSystem = useSelector((state) => state.fileSystem.fileSystem);
  const currentPath = useSelector((state) => state.fileSystem.currentPath);
  const dispatch = useDispatch();
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [renameInput, setRenameInput] = useState('');

  const handleFolderClick = (folderName) => {
    dispatch(setCurrentPath([...currentPath, folderName]));
  };

  const handleBackClick = () => {
    dispatch(setCurrentPath(currentPath.slice(0, -1)));
  };

  const handleCreateFolder = () => {
    dispatch(createFolder({ path: currentPath, folderName: newFolderName }));
    setNewFolderName('');
  };

  const handleRename = (oldName, newName) => {
    dispatch(renameItem({ path: currentPath, oldName, newName }));
    setSelectedItem(null);
    setRenameInput('');
  };

  const handleDelete = (name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (confirmDelete) {
      dispatch(deleteItem({ path: currentPath, name }));
    }
  };

  const renderFolder = (folder) => {
    if (folder.type === 'folder') {
      return (
        <li key={folder.name} className="flex items-center justify-between py-1 space-x-2">
          <button onClick={() => handleFolderClick(folder.name)} className="flex-grow text-left text-blue-500">
            📁 {folder.name}
          </button>
          <button onClick={() => setSelectedItem(folder.name)} className="p-1  bg-gray-200 rounded text-gray-600 hover:bg-gray-300 hover:text-gray-800">
    Rename
  </button>
  <button onClick={() => handleDelete(folder.name)} className="p-1 bg-red-200 rounded text-red-600 hover:bg-red-300 hover:text-red-800">
    Delete
  </button>
        </li>
      );
    }
    return (
      <li key={folder.name} className="flex items-center justify-between py-1">
        <span>📄 {folder.name}</span>
        <div className="flex space-x-2">
          <button onClick={() => setSelectedItem(folder.name)} className="p-1 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 hover:text-gray-800">
            Rename
          </button>
          <button onClick={() => handleDelete(folder.name)} className="p-1 bg-red-200 rounded text-red-600 hover:bg-red-300 hover:text-red-800">
            Delete
          </button>
        </div>
      </li>
    );
  };

  let currentFolder = fileSystem;
  currentPath.forEach((name) => {
    currentFolder = currentFolder.children.find((child) => child.name === name);
  });

  return (
    <div className="file-explorer flex h-screen">
      <div className="sidebar w-64 border-r border-gray-300 p-4 bg-gray-100 overflow-y-auto">
        <button onClick={handleBackClick} disabled={currentPath.length === 0} className="mb-4 p-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Back
        </button>
        <ul>
          {currentFolder.children.map(renderFolder)}
        </ul>
      </div>
      <div className="content flex-1 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Current Path: /{currentPath.join('/')}</h2>
        <div className="mb-4">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <button onClick={handleCreateFolder} className="p-2 bg-green-500 text-white rounded">
            Create Folder
          </button>
        </div>
        {selectedItem && (
          <div className="rename-section mt-4">
            <h3 className="text-lg font-medium mb-2">Rename {selectedItem}</h3>
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              placeholder="New name"
              className="p-2 border border-gray-300 rounded mr-2"
            />
            <button onClick={() => handleRename(selectedItem, renameInput)} className="p-2 bg-blue-500 text-white rounded mr-2">
              Rename
            </button>
            <button onClick={() => setSelectedItem(null)} className="p-2 bg-red-500 text-white rounded">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
