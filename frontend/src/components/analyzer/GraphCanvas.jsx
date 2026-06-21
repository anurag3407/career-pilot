import { useCallback, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { useAnalyzerStore } from '../../stores/useAnalyzerStore';
import AnalyzerNode from './AnalyzerNode';
import { analyzerApi } from '../../services/api';
import toast from 'react-hot-toast';

const nodeTypes = {
  analyzerNode: AnalyzerNode,
};

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 200;
  const nodeHeight = 80;

  dagreGraph.setGraph({ rankdir: direction });

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

export default function GraphCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const storeNodes = useAnalyzerStore(state => state.nodes);
  const storeEdges = useAnalyzerStore(state => state.edges);
  const sessionId = useAnalyzerStore(state => state.sessionId);
  const setSelectedFile = useAnalyzerStore(state => state.setSelectedFile);
  const setFileContent = useAnalyzerStore(state => state.setFileContent);

  useEffect(() => {
    if (storeNodes.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        storeNodes,
        storeEdges
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [storeNodes, storeEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = async (_, node) => {
    if (!sessionId) return;
    
    setSelectedFile(node.data);
    setFileContent('');
    
    try {
      const content = await analyzerApi.getFileContent(sessionId, node.data.relativePath);
      setFileContent(content);
    } catch (error) {
      toast.error('Failed to load file content');
      setFileContent('// Error loading file content');
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#050816]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
        minZoom={0.1}
        className="[&_.react-flow__pane]:bg-[#050816]"
      >
        <Background color="#1e293b" gap={16} />
        <Controls className="!bg-[#0f172a] !border-slate-700 !fill-slate-300" />
        <MiniMap 
          className="!bg-[#0f172a] !border-slate-700" 
          nodeColor="#3b82f6" 
          maskColor="rgba(5, 8, 22, 0.7)"
        />
      </ReactFlow>
    </div>
  );
}
