import React from "react";

const SocialLinksEditor = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Social Links Editor
      </h1>

      <div className="border rounded-lg p-4 mb-4">
        <h2 className="font-semibold">GitHub</h2>

        <input
          type="text"
          placeholder="Enter GitHub profile URL"
          className="border p-2 rounded w-full mt-3"
        />

        <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default SocialLinksEditor;