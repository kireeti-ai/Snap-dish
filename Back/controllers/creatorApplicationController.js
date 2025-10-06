import CreatorApplication from '../models/creatorApplicationModel.js';

// Submit a new creator application
export const submitApplication = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if an application with this email already exists
        const existingApplication = await CreatorApplication.findOne({ email });
        if (existingApplication) {
            return res.status(400).json({ message: 'An application with this email already exists.' });
        }

        // Create and save the new application
        const newApplication = new CreatorApplication(req.body);
        await newApplication.save();

        res.status(201).json({ message: 'Your application has been submitted successfully! We will get back to you soon.' });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Fetch all applications for the admin panel
export const getAllApplications = async (req, res) => {
    try {
        const applications = await CreatorApplication.find({});
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Error fetching applications.' });
    }
};

// Update the status of an application (e.g., Approve/Reject)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await CreatorApplication.findByIdAndUpdate(id, { status }, { new: true });

        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        res.status(200).json({ message: 'Application status updated successfully.', application });
    } catch (error) { // <-- The missing '{' was here
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Error updating application status.' });
    }
};