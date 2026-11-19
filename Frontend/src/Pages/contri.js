import React, { useState } from 'react';
import { Plus, X, Send, CheckCircle, AlertCircle, ChevronDown, ChevronUp, BookOpen, FileText, Video, PenTool } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const createEmptySubject = () => ({
    code: '',
    title: '',
    category: 'semesters',
    notes: '',
    resources: '',
    books: '',
    tutorial: '',
    mytutorial: '',
    NPTEL: '',
    description: '',
    expanded: false,
});

const Contri = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [subjects, setSubjects] = useState([createEmptySubject()]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (index, field, value) => {
        const updated = [...subjects];
        updated[index][field] = value;
        setSubjects(updated);
    };

    const toggleSubjectExpand = (index) => {
        const updated = [...subjects];
        updated[index].expanded = !updated[index].expanded;
        setSubjects(updated);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, createEmptySubject()]);
    };

    const handleRemoveSubject = (index) => {
        if (subjects.length > 1) {
            setSubjects(subjects.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validation
        if (!formData.name.trim() || !formData.email.trim()) {
            setError('Please enter your name and email.');
            setLoading(false);
            return;
        }

        const validSubjects = subjects.filter(s => s.title.trim().length > 0);
        if (validSubjects.length === 0) {
            setError('Please add at least one subject with a title.');
            setLoading(false);
            return;
        }

        // Check that each subject has at least one resource link or description
        for (const sub of validSubjects) {
            const hasAnyLink =
                sub.notes.trim() ||
                sub.resources.trim() ||
                sub.books.trim() ||
                sub.tutorial.trim() ||
                sub.mytutorial.trim() ||
                sub.NPTEL.trim() ||
                sub.description.trim();

            if (!hasAnyLink) {
                setError(`Please provide at least one link (Notes, Tutorial, Books, etc.) for "${sub.title}".`);
                setLoading(false);
                return;
            }
        }

        try {
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                subjects: validSubjects.map(s => ({
                    code: (s.code || '').trim().toUpperCase(),
                    title: s.title.trim(),
                    category: s.category || 'semesters',
                    notes: s.notes.trim(),
                    resources: s.resources.trim(),
                    books: s.books.trim(),
                    tutorial: s.tutorial.trim(),
                    mytutorial: s.mytutorial.trim(),
                    NPTEL: s.NPTEL.trim(),
                    description: s.description.trim(),
                })),
            };

            const res = await fetch(`${API_BASE_URL}/api/contributions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                setSuccess(true);
                setFormData({ name: '', email: '' });
                setSubjects([createEmptySubject()]);
                setTimeout(() => setSuccess(false), 7000);
            } else {
                throw new Error(result.error || 'Failed to submit contribution');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to submit your contribution. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                            Share Your Study Materials
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            Sometimes you can explain better than anyone else... share your class notes, tutorials, slides, or reference books directly with the KGP community.
                        </p>
                    </div>

                    {/* Contributor Information */}
                    <div className="space-y-6 mb-8 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                                    placeholder="e.g., Arka Ghosh"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                                    placeholder="e.g., you@iitkgp.ac.in"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Instructions Banner */}
                    <div className="mb-8 text-left bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 shadow-md">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="flex-shrink-0 mt-0.5 text-blue-200" size={20} />
                            <div className="space-y-2 text-sm leading-relaxed">
                                <p className="font-bold text-base">Google Drive Access Instructions:</p>
                                <p>
                                    Before submitting, please ensure the Google Drive file or folder sharing is set to:
                                    <strong className="ml-1 underline">"Anyone with the link can view"</strong>.
                                </p>
                                <p className="text-blue-100 text-xs">
                                    All submitted resources are stored securely in the database and synced directly with academic course pages.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Study Materials Form */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Study Materials to Contribute</h3>
                            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-full">
                                {subjects.length} {subjects.length === 1 ? 'Subject' : 'Subjects'}
                            </span>
                        </div>

                        <div className="space-y-6 text-left">
                            {subjects.map((subject, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 relative shadow-sm hover:shadow-md transition duration-200"
                                >
                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Remove subject"
                                        onClick={() => handleRemoveSubject(index)}
                                        disabled={subjects.length === 1}
                                    >
                                        <X size={20} />
                                    </button>

                                    <div className="space-y-4 pr-8">
                                        {/* Subject Code, Title & Category Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Subject Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={subject.code}
                                                    onChange={e => handleSubjectChange(index, 'code', e.target.value.toUpperCase())}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 uppercase font-mono tracking-wide outline-none"
                                                    placeholder="e.g. ET60007"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Subject / Course Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={subject.title}
                                                    onChange={e => handleSubjectChange(index, 'title', e.target.value)}
                                                    required
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                                    placeholder="e.g., Signals & Systems, Advanced Calculus"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Category <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={subject.category}
                                                    onChange={e => handleSubjectChange(index, 'category', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                                >
                                                    <option value="freshers">Freshers (1st Year)</option>
                                                    <option value="semesters">Semesters (Dept)</option>
                                                    <option value="commons">Commons</option>
                                                </select>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 italic">
                                            Tip: If you provide an existing Subject Code (e.g., ET60007), new notes and resources will directly update that course in the database.
                                        </p>

                                        {/* Primary Link: Class Notes */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                                <FileText size={16} className="text-blue-600" />
                                                Class Notes Drive Link
                                            </label>
                                            <input
                                                type="url"
                                                value={subject.notes}
                                                onChange={e => handleSubjectChange(index, 'notes', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                                                placeholder="https://drive.google.com/drive/folders/..."
                                            />
                                        </div>

                                        {/* Expandable Extra Resource Fields Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => toggleSubjectExpand(index)}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 py-1 transition"
                                        >
                                            {subject.expanded ? (
                                                <>
                                                    <ChevronUp size={18} /> Hide Additional Material Links (Tutorials, Books, NPTEL)
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown size={18} /> Add More Materials (Tutorials, Books, Resources, NPTEL)
                                                </>
                                            )}
                                        </button>

                                        {/* Additional Course Schema Fields */}
                                        {subject.expanded && (
                                            <div className="pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                                        <PenTool size={14} className="text-purple-600" />
                                                        Tutorials / Question Sheets Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={subject.tutorial}
                                                        onChange={e => handleSubjectChange(index, 'tutorial', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Google Drive link to assignment sheets"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                                        <PenTool size={14} className="text-indigo-600" />
                                                        My Solved Tutorials Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={subject.mytutorial}
                                                        onChange={e => handleSubjectChange(index, 'mytutorial', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Google Drive link to your solutions"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                                        <BookOpen size={14} className="text-amber-600" />
                                                        Recommended Books / PDFs Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={subject.books}
                                                        onChange={e => handleSubjectChange(index, 'books', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Google Drive link to textbook PDFs"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                                        <FileText size={14} className="text-teal-600" />
                                                        Additional Resources Folder Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={subject.resources}
                                                        onChange={e => handleSubjectChange(index, 'resources', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Drive folder with extra materials"
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                                                        <Video size={14} className="text-red-600" />
                                                        NPTEL / Video Lectures Playlist Link
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={subject.NPTEL}
                                                        onChange={e => handleSubjectChange(index, 'NPTEL', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="YouTube / NPTEL playlist URL"
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                                        Description / Helpful Notes
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        value={subject.description}
                                                        onChange={e => handleSubjectChange(index, 'description', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="e.g. Autumn semester slides by Prof. ..., covers midsem and endsem topics."
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add Another Subject Button */}
                    <button
                        type="button"
                        onClick={handleAddSubject}
                        className="mb-8 inline-flex items-center px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-medium shadow-sm hover:shadow transition duration-200"
                    >
                        <Plus className="mr-2" size={18} /> Add Another Subject
                    </button>

                    {/* Submit Section */}
                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 ${
                                    loading ? 'opacity-60 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Send className="mr-2 animate-spin" size={18} />
                                        Saving to Database...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2" size={18} />
                                        Submit Contribution
                                    </>
                                )}
                            </button>

                            {success && (
                                <span className="flex items-center text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200 font-medium">
                                    <CheckCircle className="mr-2 flex-shrink-0 text-green-600" size={20} />
                                    <span className="text-sm">Thank you! Your contribution has been saved to the database.</span>
                                </span>
                            )}

                            {error && (
                                <span className="flex items-center text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-200 font-medium">
                                    <AlertCircle className="mr-2 flex-shrink-0 text-red-600" size={20} />
                                    <span className="text-sm">{error}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contri;
