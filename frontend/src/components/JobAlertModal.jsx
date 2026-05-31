import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, MapPin, DollarSign, Briefcase, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobAlertsApi } from '../services/api';

const EMPLOYMENT_TYPES = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
];

export default function JobAlertModal({ isOpen, onClose, onSuccess, editAlert = null }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: editAlert?.title || '',
        keywords: editAlert?.keywords?.join(', ') || '',
        location: editAlert?.location || '',
        remoteOnly: editAlert?.remoteOnly || false,
        salaryMin: editAlert?.salaryMin || '',
        salaryMax: editAlert?.salaryMax || '',
        employmentType: editAlert?.employmentType || ['full-time']
    });

    useEffect(() => {
        setFormData({
            title: editAlert?.title || '',
            keywords: editAlert?.keywords?.join(', ') || '',
            location: editAlert?.location || '',
            remoteOnly: editAlert?.remoteOnly || false,
            salaryMin: editAlert?.salaryMin || '',
            salaryMax: editAlert?.salaryMax || '',
            employmentType: editAlert?.employmentType || ['full-time']
        });
    }, [editAlert]);

    const parseSalary = (value) => {
        const trimmed = String(value ?? '').trim();
        if (!trimmed) return null;
        const parsed = Number(trimmed);
        return Number.isFinite(parsed) ? parsed : null;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEmploymentTypeChange = (type) => {
        setFormData(prev => {
            const current = prev.employmentType;
            if (current.includes(type)) {
                return { ...prev, employmentType: current.filter(t => t !== type) };
            }
            return { ...prev, employmentType: [...current, type] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Please enter an alert title');
            return;
        }

        setLoading(true);
        try {
            const alertData = {
                title: formData.title.trim(),
                keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
                location: formData.location.trim(),
                remoteOnly: formData.remoteOnly,
                salaryMin: parseSalary(formData.salaryMin),
                salaryMax: parseSalary(formData.salaryMax),
                employmentType: formData.employmentType
            };

            if (editAlert) {
                await jobAlertsApi.update(editAlert._id, alertData);
                toast.success('Alert updated successfully!');
            } else {
                await jobAlertsApi.create(alertData);
                toast.success('Job alert created! 🎉');
            }

            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to save alert');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl my-8 max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5 shrink-0 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-foreground/20 rounded-lg">
                                    <Bell className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <h2 className="text-xl font-semibold text-primary-foreground">
                                    {editAlert ? 'Edit Job Alert' : 'Create Job Alert'}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5 text-primary-foreground" />
                            </button>
                        </div>
                        <p className="mt-2 text-primary-foreground/80 text-sm">
                            Get notified when new jobs match your preferences
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
                        {/* Alert Title */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                <Briefcase className="w-4 h-4 inline mr-1.5" />
                                Job Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Frontend Developer"
                                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                required
                            />
                        </div>

                        {/* Keywords */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                <Tag className="w-4 h-4 inline mr-1.5" />
                                Keywords (comma separated)
                            </label>
                            <input
                                type="text"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleInputChange}
                                placeholder="e.g., React, TypeScript, Remote"
                                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Location + Remote */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    <MapPin className="w-4 h-4 inline mr-1.5" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., San Francisco, CA"
                                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50"
                                    disabled={formData.remoteOnly}
                                />
                            </div>
                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="remoteOnly"
                                        checked={formData.remoteOnly}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary"
                                    />
                                    <span className="text-sm text-foreground">Remote only</span>
                                </label>
                            </div>
                        </div>

                        {/* Salary Range */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                <DollarSign className="w-4 h-4 inline mr-1.5" />
                                Salary Range (USD/year)
                            </label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="number"
                                    name="salaryMin"
                                    value={formData.salaryMin}
                                    onChange={handleInputChange}
                                    placeholder="Min"
                                    className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                />
                                <span className="text-muted-foreground">to</span>
                                <input
                                    type="number"
                                    name="salaryMax"
                                    value={formData.salaryMax}
                                    onChange={handleInputChange}
                                    placeholder="Max"
                                    className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        {/* Employment Type */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Employment Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {EMPLOYMENT_TYPES.map(type => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleEmploymentTypeChange(type.value)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${formData.employmentType.includes(type.value)
                                                ? 'bg-primary/20 text-primary border-2 border-primary/50'
                                                : 'bg-muted text-muted-foreground border-2 border-transparent hover:bg-muted/80'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-border sticky bottom-0 bg-card pb-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground font-medium hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : (editAlert ? 'Update Alert' : 'Create Alert')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
