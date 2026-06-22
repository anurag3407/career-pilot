import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    Bell,
    BellOff,
    Plus,
    Trash2,
    Edit2,
    Play,
    MapPin,
    Clock,
    Briefcase,
    Loader2,
    AlertCircle,
    GripVertical
} from 'lucide-react';
import { SkeletonList } from './ui/Skeleton';
import toast from 'react-hot-toast';
import { jobAlertsApi } from '../services/api';
import JobAlertModal from './JobAlertModal';
import Tooltip from './ui/Tooltip';

export default function JobAlertsList() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAlert, setEditingAlert] = useState(null);
    const [testingId, setTestingId] = useState(null);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await jobAlertsApi.getAll();
            setAlerts(response.alerts || []);
        } catch (err) {
            setError(err.message || 'Failed to load alerts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 py-8">
                <SkeletonList count={4} />
            </div>
        );
    }

    const handleToggle = async (alertId) => {
        try {
            const result = await jobAlertsApi.toggle(alertId);
            setAlerts(prev => prev.map(alert =>
                alert._id === alertId ? { ...alert, isActive: result.isActive } : alert
            ));
            toast.success(result.isActive ? 'Alert activated' : 'Alert paused');
        } catch (err) {
            toast.error(err.message || 'Failed to toggle alert');
        }
    };

    const handleDelete = async (alertId) => {
        if (!confirm('Are you sure you want to delete this alert?')) return;
        try {
            await jobAlertsApi.delete(alertId);
            setAlerts(prev => prev.filter(alert => alert._id !== alertId));
            toast.success('Alert deleted');
        } catch (err) {
            toast.error(err.message || 'Failed to delete alert');
        }
    };

    const handleTest = async (alertId) => {
        setTestingId(alertId);
        try {
            const result = await jobAlertsApi.test(alertId);
            toast.success(`Found ${result.result?.newJobs || 0} new jobs!`);
        } catch (err) {
            toast.error(err.message || 'Failed to test alert');
        } finally {
            setTestingId(null);
        }
    };

    const handleEdit = (alert) => {
        setEditingAlert(alert);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingAlert(null);
    };

    // Reorder alerts after drag ends
    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const reordered = Array.from(alerts);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        setAlerts(reordered);

        try {
            await jobAlertsApi.reorder(reordered.map(a => a._id));
            toast.success('Alert order updated');
        } catch (err) {
            toast.error('Failed to save alert order');
            // Revert on failure
            fetchAlerts();
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <p className="text-muted-foreground">{error}</p>
                <button
                    onClick={fetchAlerts}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Job Alerts</h2>
                    <p className="text-muted-foreground mt-1">
                        Get notified when jobs matching your criteria are posted
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Create Alert
                </button>
            </div>

            {/* Alerts List */}
            {alerts.length === 0 ? (
                <div className="text-center py-16 bg-card/50 rounded-2xl border-2 border-dashed border-border">
                    <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No job alerts yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                        Create your first alert to get notified about new job opportunities
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Create Your First Alert
                    </button>
                </div>
            ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="job-alerts-list">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`space-y-4 transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                            >
                                {alerts.map((alert, index) => (
                                    <Draggable key={alert._id} draggableId={alert._id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                style={provided.draggableProps.style}
                                                className={`bg-card rounded-xl border p-5 transition-all hover:border-primary/50 ${
                                                    alert.isActive ? 'border-border shadow-sm' : 'border-border opacity-60'
                                                } ${snapshot.isDragging ? 'shadow-2xl scale-[1.02] border-primary/60 rotate-[0.5deg]' : ''}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-4">
                                                        {/* Drag Handle */}
                                                        <button
                                                            type="button"
                                                            {...provided.dragHandleProps}
                                                            className="mt-1 p-1 text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing rounded transition-colors"
                                                            aria-label="Drag to reorder"
                                                        >
                                                            <GripVertical className="w-5 h-5" />
                                                        </button>

                                                        {/* Alert Number */}
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                                                            alert.isActive
                                                                ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground'
                                                                : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                            {index + 1}
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="font-semibold text-foreground text-lg">{alert.title}</h3>
                                                                {!alert.isActive && (
                                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                                                        Paused
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                                {alert.location && (
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="w-4 h-4" />
                                                                        {alert.location}
                                                                    </span>
                                                                )}
                                                                {alert.remoteOnly && (
                                                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs">
                                                                        Remote Only
                                                                    </span>
                                                                )}
                                                                {alert.employmentType?.length > 0 && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Briefcase className="w-4 h-4" />
                                                                        {alert.employmentType.join(', ')}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {alert.keywords?.length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5 mt-3">
                                                                    {alert.keywords.map((kw, i) => (
                                                                        <span
                                                                            key={i}
                                                                            className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-medium"
                                                                        >
                                                                            {kw}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    Last checked: {formatDate(alert.lastCheckedAt)}
                                                                </span>
                                                                <span>{alert.totalJobsFound || 0} jobs found</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <Tooltip content="Test alert now">
                                                            <button
                                                                onClick={() => handleTest(alert._id)}
                                                                disabled={testingId === alert._id}
                                                                className="p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                                aria-label="Test alert now"
                                                            >
                                                                {testingId === alert._id ? (
                                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                                ) : (
                                                                    <Play className="w-5 h-5" />
                                                                )}
                                                            </button>
                                                        </Tooltip>

                                                        <Tooltip content={alert.isActive ? 'Pause alert' : 'Activate alert'}>
                                                            <button
                                                                onClick={() => handleToggle(alert._id)}
                                                                className={`p-2 rounded-lg transition-colors ${
                                                                    alert.isActive
                                                                        ? 'text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10'
                                                                        : 'text-amber-500 hover:bg-amber-500/10'
                                                                }`}
                                                                aria-label={alert.isActive ? 'Pause alert' : 'Activate alert'}
                                                            >
                                                                {alert.isActive ? (
                                                                    <BellOff className="w-5 h-5" />
                                                                ) : (
                                                                    <Bell className="w-5 h-5" />
                                                                )}
                                                            </button>
                                                        </Tooltip>

                                                        <Tooltip content="Edit alert">
                                                            <button
                                                                onClick={() => handleEdit(alert)}
                                                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                                aria-label="Edit alert"
                                                            >
                                                                <Edit2 className="w-5 h-5" />
                                                            </button>
                                                        </Tooltip>

                                                        <Tooltip content="Delete alert">
                                                            <button
                                                                onClick={() => handleDelete(alert._id)}
                                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                                aria-label="Delete alert"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}

            {/* Modal */}
            <JobAlertModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={fetchAlerts}
                editAlert={editingAlert}
            />
        </div>
    );
}
