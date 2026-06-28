import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  ReactFlow, Controls, MiniMap, Background, 
  useNodesState, useEdgesState, Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { Box, FileCode, Search, Maximize } from 'lucide-react';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import ModuleNode from './ModuleNode';
import FileNode from './FileNode';
import { cn } from '../../lib/utils';

const nodeTypes = {
  moduleNode: ModuleNode,
  fileNode: FileNode
};

const getLayoutedElements = (nodes, edges, direction = 'TB', isFileNode = false) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = isFileNode ? 200 : 220;
  const nodeHeight = isFileNode ? 70 : 100;

  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 50 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

const ArchitectureCanvas = () => {
  const { 
    moduleGraph, fileGraph, viewMode, setViewMode, 
    setSelectedModule, setSelectedFile, selectedModule, selectedFile 
  } = useProjectVisualizerStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial layout and view changes
  useEffect(() => {
    const rawNodes = viewMode === 'modules' ? moduleGraph.nodes : fileGraph.nodes;
    const rawEdges = viewMode === 'modules' ? moduleGraph.edges : fileGraph.edges;
    
    if (!rawNodes || rawNodes.length === 0) return;
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      rawNodes, 
      rawEdges, 
      'TB',
      viewMode === 'files'
    );
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [moduleGraph, fileGraph, viewMode, setNodes, setEdges]);

  // Handle selection state visually
  useEffect(() => {
    setNodes(nds => nds.map(n => ({
      ...n,
      selected: viewMode === 'modules' 
        ? selectedModule?.name === n.id 
        : selectedFile?.relativePath === n.id
    })));
  }, [selectedModule, selectedFile, viewMode, setNodes]);

  // Handle Search Filtering (Highlights nodes)
  useEffect(() => {
    if (!searchQuery) {
      setNodes(nds => nds.map(n => ({ ...n, hidden: false, style: { opacity: 1 } })));
      setEdges(eds => eds.map(e => ({ ...e, hidden: false, style: { ...e.style, opacity: 1 } })));
      return;
    }
    
    const lowerQ = searchQuery.toLowerCase();
    
    setNodes(nds => nds.map(n => {
      const match = viewMode === 'modules' 
        ? n.data.name.toLowerCase().includes(lowerQ)
        : n.data.fileName.toLowerCase().includes(lowerQ);
        
      return { ...n, style: { ...n.style, opacity: match ? 1 : 0.2 } };
    }));
    
  }, [searchQuery, viewMode, setNodes, setEdges]);

  const onNodeClick = useCallback((_, node) => {
    if (node.type === 'moduleNode') {
      setSelectedModule(node.data);
    } else if (node.type === 'fileNode') {
      setSelectedFile(node.data);
    }
  }, [setSelectedModule, setSelectedFile]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-black/40 border border-white/5 rounded-2xl">
        <div className="text-slate-500 flex flex-col items-center">
          <Maximize className="w-12 h-12 mb-4 opacity-20" />
          <p>No graph data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[600px] bg-black/40 border border-white/5 rounded-2xl overflow-hidden relative">
      
      {/* Top Bar overlays */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        
        {/* View Toggles */}
        <div className="bg-[#0f172a]/90 backdrop-blur border border-white/10 rounded-lg p-1 flex gap-1 pointer-events-auto">
          <button type="button"
            onClick={() => setViewMode('modules')}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",
              viewMode === 'modules' ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Box className="w-4 h-4" /> Modules
          </button>
          <button type="button"
            onClick={() => setViewMode('files')}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",
              viewMode === 'files' ? "bg-violet-500/20 text-violet-400" : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <FileCode className="w-4 h-4" /> Files
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#0f172a]/90 backdrop-blur border border-white/10 rounded-lg p-2 flex items-center w-64 pointer-events-auto">
          <Search className="w-4 h-4 text-slate-400 mx-2" />
          <input 
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-slate-500"
          />
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full"
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#333" gap={20} size={1} />
        <Controls className="bg-[#0f172a] border-slate-700 fill-white text-white" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'moduleNode') return '#06b6d4';
            return '#3178c6';
          }}
          className="bg-[#0f172a] border-slate-700 !bottom-4 !right-4 rounded-lg overflow-hidden"
          maskColor="rgba(0,0,0, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};

export default ArchitectureCanvas;
