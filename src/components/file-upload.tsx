import React, { useState } from 'react';

export default function EssayUploadForm() {
    const [essay, setEssay] = useState('');
    const [webinarContent, setWebinarContent] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'essay') {
            setEssay(value);
        } else if (name === 'webinarContent') {
            setWebinarContent(value);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('essay', essay);
        formData.append('webinarContent', webinarContent);

        const response = await fetch('/api/process', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Feedback:', result.feedback);
        } else {
            console.error('Error:', result.error);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-lg font-semibold">Submit Essay and Webinar Content</h1>
            <textarea
                name="essay"
                placeholder="Enter your essay here..."
                value={essay}
                onChange={handleInputChange}
                className="w-full p-2 border"
            />
            <textarea
                name="webinarContent"
                placeholder="Enter webinar content here..."
                value={webinarContent}
                onChange={handleInputChange}
                className="w-full p-2 border"
            />
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white">
                Submit
            </button>
        </div>
    );
}
