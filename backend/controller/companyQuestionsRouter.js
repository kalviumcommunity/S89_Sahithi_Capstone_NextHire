const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// In-memory storage for user attempts (in production, use database)
const userAttempts = new Map(); // userId -> { company -> [questionIds] }

// Helper function to get user's previous question IDs for a company
function getUserPreviousQuestions(userId, company) {
    if (!userAttempts.has(userId)) {
        userAttempts.set(userId, {});
    }

    const userCompanyAttempts = userAttempts.get(userId);
    if (!userCompanyAttempts[company]) {
        userCompanyAttempts[company] = [];
    }

    return userCompanyAttempts[company];
}

// Helper function to save user's attempted questions
function saveUserAttempt(userId, company, questionIds) {
    if (!userAttempts.has(userId)) {
        userAttempts.set(userId, {});
    }

    const userCompanyAttempts = userAttempts.get(userId);
    if (!userCompanyAttempts[company]) {
        userCompanyAttempts[company] = [];
    }

    // Add new question IDs to the user's attempt history
    userCompanyAttempts[company].push(...questionIds);

    // Keep only unique question IDs
    userCompanyAttempts[company] = [...new Set(userCompanyAttempts[company])];
}

// Real company-wise questions database
const companyQuestions = {
    "Google": [
        {
            id: 1,
            question: "What is the time complexity of searching in a balanced binary search tree?",
            options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
            answer: "O(log n)",
            difficulty: "Medium",
            topic: "Data Structures"
        },
        {
            id: 2,
            question: "Which design pattern is used to ensure a class has only one instance?",
            options: ["Factory", "Singleton", "Observer", "Strategy"],
            answer: "Singleton",
            difficulty: "Easy",
            topic: "Design Patterns"
        },
        {
            id: 3,
            question: "What is the purpose of Google's PageRank algorithm?",
            options: ["Sort search results", "Rank web pages", "Compress data", "Encrypt information"],
            answer: "Rank web pages",
            difficulty: "Medium",
            topic: "Algorithms"
        },
        {
            id: 4,
            question: "In distributed systems, what is the CAP theorem?",
            options: ["Consistency, Availability, Partition tolerance", "Cache, API, Performance", "CPU, Algorithm, Process", "Code, Architecture, Platform"],
            answer: "Consistency, Availability, Partition tolerance",
            difficulty: "Hard",
            topic: "System Design"
        },
        {
            id: 5,
            question: "What is the space complexity of merge sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            answer: "O(n)",
            difficulty: "Medium",
            topic: "Algorithms"
        },
        {
            id: 6,
            question: "What is the difference between HashMap and TreeMap in Java?",
            options: ["No difference", "HashMap is sorted, TreeMap is not", "TreeMap is sorted, HashMap is not", "Both are always sorted"],
            answer: "TreeMap is sorted, HashMap is not",
            difficulty: "Medium",
            topic: "Data Structures"
        },
        {
            id: 7,
            question: "What is the purpose of Google's MapReduce framework?",
            options: ["Web crawling", "Distributed data processing", "Image recognition", "Machine learning"],
            answer: "Distributed data processing",
            difficulty: "Hard",
            topic: "Distributed Systems"
        },
        {
            id: 8,
            question: "Which sorting algorithm has the best average-case time complexity?",
            options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Both Quick Sort and Merge Sort"],
            answer: "Both Quick Sort and Merge Sort",
            difficulty: "Medium",
            topic: "Algorithms"
        },
        {
            id: 9,
            question: "What is the difference between process and thread?",
            options: ["No difference", "Process is lighter than thread", "Thread is lighter than process", "Both are same weight"],
            answer: "Thread is lighter than process",
            difficulty: "Easy",
            topic: "Operating Systems"
        },
        {
            id: 10,
            question: "What is Google's Bigtable?",
            options: ["SQL database", "NoSQL distributed database", "File system", "Web server"],
            answer: "NoSQL distributed database",
            difficulty: "Hard",
            topic: "Database"
        }
    ],
    "Microsoft": [
        {
            id: 1,
            question: "What is polymorphism in object-oriented programming?",
            options: ["Multiple inheritance", "Method overloading", "Ability to take multiple forms", "Data encapsulation"],
            answer: "Ability to take multiple forms",
            difficulty: "Medium",
            topic: "OOP"
        },
        {
            id: 2,
            question: "Which data structure is used for implementing recursion?",
            options: ["Queue", "Stack", "Array", "Linked List"],
            answer: "Stack",
            difficulty: "Easy",
            topic: "Data Structures"
        },
        {
            id: 3,
            question: "What is the main advantage of Azure cloud computing?",
            options: ["Cost reduction", "Scalability", "Security", "All of the above"],
            answer: "All of the above",
            difficulty: "Easy",
            topic: "Cloud Computing"
        },
        {
            id: 4,
            question: "In SQL Server, what is a clustered index?",
            options: ["Index on multiple columns", "Index that determines physical storage", "Index for fast searching", "Index for sorting"],
            answer: "Index that determines physical storage",
            difficulty: "Hard",
            topic: "Database"
        },
        {
            id: 5,
            question: "What is the difference between abstract class and interface in C#?",
            options: ["No difference", "Abstract class can have implementation", "Interface is faster", "Abstract class is deprecated"],
            answer: "Abstract class can have implementation",
            difficulty: "Medium",
            topic: "Programming Languages"
        },
        {
            id: 6,
            question: "What is Azure Service Bus?",
            options: ["Database service", "Message queuing service", "Web hosting service", "Storage service"],
            answer: "Message queuing service",
            difficulty: "Medium",
            topic: "Cloud Computing"
        },
        {
            id: 7,
            question: "What is the difference between IEnumerable and IQueryable in C#?",
            options: ["No difference", "IQueryable is for databases", "IEnumerable is faster", "IQueryable is deprecated"],
            answer: "IQueryable is for databases",
            difficulty: "Hard",
            topic: "Programming Languages"
        },
        {
            id: 8,
            question: "What is Microsoft's SOLID principles?",
            options: ["Database design principles", "Object-oriented design principles", "Network protocols", "Security guidelines"],
            answer: "Object-oriented design principles",
            difficulty: "Medium",
            topic: "Software Engineering"
        },
        {
            id: 9,
            question: "What is the purpose of Entity Framework?",
            options: ["Web framework", "ORM framework", "Testing framework", "UI framework"],
            answer: "ORM framework",
            difficulty: "Easy",
            topic: "Programming Languages"
        },
        {
            id: 10,
            question: "What is Azure Functions?",
            options: ["Database functions", "Serverless computing", "Web hosting", "File storage"],
            answer: "Serverless computing",
            difficulty: "Medium",
            topic: "Cloud Computing"
        }
    ],
    "Amazon": [
        {
            id: 1,
            question: "What is the principle behind Amazon's leadership principle 'Customer Obsession'?",
            options: ["Focus on competitors", "Start with customer and work backwards", "Maximize profits", "Reduce costs"],
            answer: "Start with customer and work backwards",
            difficulty: "Easy",
            topic: "Leadership Principles"
        },
        {
            id: 2,
            question: "What is the time complexity of finding an element in a hash table?",
            options: ["O(1) average case", "O(n)", "O(log n)", "O(n²)"],
            answer: "O(1) average case",
            difficulty: "Medium",
            topic: "Data Structures"
        },
        {
            id: 3,
            question: "What is AWS Lambda?",
            options: ["Database service", "Serverless computing service", "Storage service", "Networking service"],
            answer: "Serverless computing service",
            difficulty: "Easy",
            topic: "Cloud Services"
        },
        {
            id: 4,
            question: "Which algorithm is best for finding shortest path in a weighted graph?",
            options: ["BFS", "DFS", "Dijkstra's", "Binary Search"],
            answer: "Dijkstra's",
            difficulty: "Hard",
            topic: "Algorithms"
        },
        {
            id: 5,
            question: "What is the difference between SQL and NoSQL databases?",
            options: ["No difference", "SQL is structured, NoSQL is flexible", "NoSQL is faster", "SQL is deprecated"],
            answer: "SQL is structured, NoSQL is flexible",
            difficulty: "Medium",
            topic: "Database"
        },
        {
            id: 6,
            question: "What is Amazon's leadership principle 'Ownership'?",
            options: ["Own company stock", "Take responsibility for decisions", "Manage teams", "Control resources"],
            answer: "Take responsibility for decisions",
            difficulty: "Easy",
            topic: "Leadership Principles"
        },
        {
            id: 7,
            question: "What is AWS EC2?",
            options: ["Database service", "Virtual server service", "Storage service", "Networking service"],
            answer: "Virtual server service",
            difficulty: "Easy",
            topic: "Cloud Services"
        },
        {
            id: 8,
            question: "What is the difference between DynamoDB and RDS?",
            options: ["No difference", "DynamoDB is NoSQL, RDS is SQL", "RDS is faster", "DynamoDB is deprecated"],
            answer: "DynamoDB is NoSQL, RDS is SQL",
            difficulty: "Medium",
            topic: "Database"
        },
        {
            id: 9,
            question: "What is Amazon's 'Day 1' mentality?",
            options: ["First day at work", "Startup mindset", "Daily planning", "Morning meetings"],
            answer: "Startup mindset",
            difficulty: "Medium",
            topic: "Leadership Principles"
        },
        {
            id: 10,
            question: "What is AWS S3?",
            options: ["Computing service", "Database service", "Object storage service", "Networking service"],
            answer: "Object storage service",
            difficulty: "Easy",
            topic: "Cloud Services"
        }
    ],
    "Apple": [
        {
            id: 1,
            question: "What is the main programming language used for iOS development?",
            options: ["Java", "Swift", "Python", "C++"],
            answer: "Swift",
            difficulty: "Easy",
            topic: "Mobile Development"
        },
        {
            id: 2,
            question: "What is MVC architecture pattern?",
            options: ["Model-View-Controller", "Multiple-Virtual-Computing", "Mobile-Virtual-Cloud", "Memory-Video-Cache"],
            answer: "Model-View-Controller",
            difficulty: "Medium",
            topic: "Architecture"
        },
        {
            id: 3,
            question: "What is the purpose of Core Data in iOS?",
            options: ["Networking", "Data persistence", "UI rendering", "Memory management"],
            answer: "Data persistence",
            difficulty: "Medium",
            topic: "iOS Development"
        },
        {
            id: 4,
            question: "What is the difference between strong and weak references in Swift?",
            options: ["No difference", "Strong prevents deallocation, weak allows it", "Weak is faster", "Strong is deprecated"],
            answer: "Strong prevents deallocation, weak allows it",
            difficulty: "Hard",
            topic: "Memory Management"
        },
        {
            id: 5,
            question: "What is Auto Layout in iOS?",
            options: ["Automatic code generation", "Dynamic UI constraint system", "Memory management", "Performance optimization"],
            answer: "Dynamic UI constraint system",
            difficulty: "Medium",
            topic: "UI Development"
        }
    ],
    "Meta": [
        {
            id: 1,
            question: "What is React's virtual DOM?",
            options: ["Real DOM copy", "In-memory representation of DOM", "Database", "Server"],
            answer: "In-memory representation of DOM",
            difficulty: "Medium",
            topic: "Frontend"
        },
        {
            id: 2,
            question: "What is the purpose of Redux in React applications?",
            options: ["Styling", "State management", "Routing", "Testing"],
            answer: "State management",
            difficulty: "Medium",
            topic: "Frontend"
        },
        {
            id: 3,
            question: "What is GraphQL?",
            options: ["Database", "Query language for APIs", "Programming language", "Framework"],
            answer: "Query language for APIs",
            difficulty: "Medium",
            topic: "Backend"
        },
        {
            id: 4,
            question: "What is the time complexity of bubble sort?",
            options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            answer: "O(n²)",
            difficulty: "Easy",
            topic: "Algorithms"
        },
        {
            id: 5,
            question: "What is the difference between REST and GraphQL?",
            options: ["No difference", "REST uses multiple endpoints, GraphQL uses one", "GraphQL is faster", "REST is deprecated"],
            answer: "REST uses multiple endpoints, GraphQL uses one",
            difficulty: "Hard",
            topic: "API Design"
        }
    ],
    "Netflix": [
        {
            id: 1,
            question: "What is microservices architecture?",
            options: ["Small applications", "Distributed system of small services", "Mobile apps", "Database design"],
            answer: "Distributed system of small services",
            difficulty: "Medium",
            topic: "System Design"
        },
        {
            id: 2,
            question: "What is the purpose of a load balancer?",
            options: ["Store data", "Distribute traffic", "Encrypt data", "Monitor performance"],
            answer: "Distribute traffic",
            difficulty: "Medium",
            topic: "System Design"
        },
        {
            id: 3,
            question: "What is eventual consistency in distributed systems?",
            options: ["Immediate consistency", "Consistency achieved over time", "No consistency", "Perfect consistency"],
            answer: "Consistency achieved over time",
            difficulty: "Hard",
            topic: "Distributed Systems"
        },
        {
            id: 4,
            question: "What is the purpose of caching in web applications?",
            options: ["Security", "Performance improvement", "Data storage", "User authentication"],
            answer: "Performance improvement",
            difficulty: "Easy",
            topic: "Performance"
        },
        {
            id: 5,
            question: "What is Docker used for?",
            options: ["Database management", "Containerization", "Web development", "Mobile apps"],
            answer: "Containerization",
            difficulty: "Medium",
            topic: "DevOps"
        }
    ]
};

// Get all available companies
router.get('/companies', auth, (req, res) => {
    try {
        const companies = Object.keys(companyQuestions);
        res.json({
            success: true,
            companies,
            message: 'Companies retrieved successfully'
        });
    } catch (error) {
        console.error('Get companies error:', error);
        res.status(500).json({ message: 'Server error while fetching companies' });
    }
});

// Get questions for a specific company (with automatic attempt tracking)
router.get('/questions/:company', auth, (req, res) => {
    try {
        const { company } = req.params;
        const { count = 5, difficulty, topic, allowRepeats = 'false' } = req.query;
        const userId = req.user._id.toString();

        console.log(`Getting questions for user ${userId}, company ${company}, allowRepeats: ${allowRepeats}`);

        if (!companyQuestions[company]) {
            return res.status(404).json({ message: 'Company not found' });
        }

        let questions = [...companyQuestions[company]];

        // Filter by difficulty if specified
        if (difficulty && difficulty !== 'All') {
            questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
        }

        // Filter by topic if specified
        if (topic && topic !== 'All') {
            questions = questions.filter(q => q.topic.toLowerCase().includes(topic.toLowerCase()));
        }

        // Get user's previous attempts for this company
        const previousQuestionIds = getUserPreviousQuestions(userId, company);
        console.log(`User ${userId} has attempted questions:`, previousQuestionIds);

        // By default, always exclude previously seen questions (unless allowRepeats is true)
        if (allowRepeats !== 'true' && previousQuestionIds.length > 0) {
            const originalCount = questions.length;
            questions = questions.filter(q => !previousQuestionIds.includes(q.id));
            console.log(`Filtered out ${originalCount - questions.length} previously seen questions`);

            // If no new questions available, reset user's attempts for this company
            if (questions.length === 0) {
                console.log(`No new questions available for user ${userId} in ${company}, resetting attempts`);
                if (userAttempts.has(userId)) {
                    userAttempts.get(userId)[company] = [];
                }
                questions = [...companyQuestions[company]];

                // Re-apply filters
                if (difficulty && difficulty !== 'All') {
                    questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
                }
                if (topic && topic !== 'All') {
                    questions = questions.filter(q => q.topic.toLowerCase().includes(topic.toLowerCase()));
                }
                console.log(`Reset complete, ${questions.length} questions available`);
            }
        }

        // Shuffle and limit questions
        const shuffled = questions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, parseInt(count));

        console.log(`Selected questions:`, selectedQuestions.map(q => q.id));

        // Save this attempt (always track)
        const selectedQuestionIds = selectedQuestions.map(q => q.id);
        saveUserAttempt(userId, company, selectedQuestionIds);

        // Calculate attempt statistics
        const totalQuestionsInCompany = companyQuestions[company].length;
        const updatedPreviousQuestions = getUserPreviousQuestions(userId, company);
        const questionsAttempted = updatedPreviousQuestions.length;
        const questionsRemaining = totalQuestionsInCompany - questionsAttempted;

        res.json({
            success: true,
            company,
            questions: selectedQuestions,
            totalAvailable: questions.length,
            attemptInfo: {
                isNewAttempt: allowRepeats !== 'true',
                questionsAttempted,
                questionsRemaining: Math.max(0, questionsRemaining),
                totalQuestions: totalQuestionsInCompany,
                attemptsCount: Math.ceil(questionsAttempted / parseInt(count)),
                previousQuestionIds: updatedPreviousQuestions
            },
            message: allowRepeats === 'true' ?
                'Questions retrieved (repeats allowed)' :
                'New questions retrieved successfully'
        });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ message: 'Server error while fetching questions' });
    }
});

// Reset user attempts for a company
router.post('/reset-attempts/:company', auth, (req, res) => {
    try {
        const { company } = req.params;
        const userId = req.user._id.toString();

        if (!companyQuestions[company]) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Reset user's attempts for this company
        if (userAttempts.has(userId)) {
            const userCompanyAttempts = userAttempts.get(userId);
            userCompanyAttempts[company] = [];
        }

        res.json({
            success: true,
            company,
            message: `Attempts reset successfully for ${company}. You can now get all questions again.`
        });
    } catch (error) {
        console.error('Reset attempts error:', error);
        res.status(500).json({ message: 'Server error while resetting attempts' });
    }
});

// Debug endpoint to check all user attempts
router.get('/debug/attempts', auth, (req, res) => {
    try {
        const userId = req.user._id.toString();

        const userAttemptData = userAttempts.get(userId) || {};

        res.json({
            success: true,
            userId,
            allAttempts: userAttemptData,
            totalUsers: userAttempts.size,
            message: 'Debug information retrieved successfully'
        });
    } catch (error) {
        console.error('Debug attempts error:', error);
        res.status(500).json({ message: 'Server error while fetching debug info' });
    }
});

// Get user's attempt history for a company
router.get('/attempts/:company', auth, (req, res) => {
    try {
        const { company } = req.params;
        const userId = req.user._id.toString();

        if (!companyQuestions[company]) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const previousQuestionIds = getUserPreviousQuestions(userId, company);
        const totalQuestions = companyQuestions[company].length;
        const questionsRemaining = totalQuestions - previousQuestionIds.length;

        res.json({
            success: true,
            company,
            attemptHistory: {
                questionsAttempted: previousQuestionIds.length,
                questionsRemaining: Math.max(0, questionsRemaining),
                totalQuestions,
                attemptedQuestionIds: previousQuestionIds,
                canGetNewQuestions: questionsRemaining > 0
            },
            message: 'Attempt history retrieved successfully'
        });
    } catch (error) {
        console.error('Get attempts error:', error);
        res.status(500).json({ message: 'Server error while fetching attempts' });
    }
});

// Get question statistics for a company
router.get('/stats/:company', auth, (req, res) => {
    try {
        const { company } = req.params;
        
        if (!companyQuestions[company]) {
            return res.status(404).json({ message: 'Company not found' });
        }
        
        const questions = companyQuestions[company];
        const stats = {
            total: questions.length,
            byDifficulty: {
                Easy: questions.filter(q => q.difficulty === 'Easy').length,
                Medium: questions.filter(q => q.difficulty === 'Medium').length,
                Hard: questions.filter(q => q.difficulty === 'Hard').length
            },
            byTopic: {}
        };
        
        // Count by topics
        questions.forEach(q => {
            stats.byTopic[q.topic] = (stats.byTopic[q.topic] || 0) + 1;
        });
        
        res.json({
            success: true,
            company,
            stats,
            message: 'Statistics retrieved successfully'
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error while fetching statistics' });
    }
});

module.exports = router;
