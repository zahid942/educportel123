const pool = require("../config/db");
// About Us page data
exports.getAboutUs = async (req, res) => {
    try {
        const aboutData = {
            title: "About EduPortal - Learning Management System",
            description: "EduPortal is a modern, user-friendly Learning Management System designed to make education more accessible, efficient, and engaging for both students and teachers.",
            mission: "To revolutionize education through technology and make learning accessible to everyone.",
            vision: "To be the leading LMS platform that transforms how education is delivered and experienced.",
            features: [
                "Easy assignment and grade management",
                "Real-time results and performance tracking",
                "Comprehensive resource sharing platform",
                "Interactive dashboard for students and teachers",
                "Secure and scalable cloud-based architecture"
            ],
            team: [
                { name: "John Smith", role: "Founder & CEO", bio: "Education technology enthusiast with 10+ years experience" },
                { name: "Sarah Johnson", role: "Lead Developer", bio: "Full-stack developer passionate about creating educational solutions" },
                { name: "Mike Chen", role: "UI/UX Designer", bio: "Designing intuitive interfaces for better learning experiences" }
            ],
            stats: {
                studentsServed: 5000,
                coursesAvailable: 150,
                successRate: 98,
                yearsOperating: 3
            }
        };
        
        res.json({
            success: true,
            ...aboutData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching about data',
            error: error.message
        });
    }
};

// Contact information
exports.getContactInfo = async (req, res) => {
    try {
        const contactData = {
            email: "support@eduportal.com",
            phone: "+1 (555) 123-EDU",
            address: "123 Education Street, Learning City, LC 12345",
            supportHours: "Monday - Friday, 9:00 AM - 6:00 PM",
            socialMedia: {
                twitter: "https://twitter.com/eduportal",
                facebook: "https://facebook.com/eduportal",
                linkedin: "https://linkedin.com/company/eduportal"
            }
        };
        
        res.json({
            success: true,
            ...contactData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching contact information',
            error: error.message
        });
    }
};