import React, { useState } from 'react';
import useSoundEffects from '../hooks/useSoundEffects';
import '../styles/companyWiseQuestions.css';

// --- Apple ---
const appleQuestions =[
  {
    "question": "Which of the following programming languages is primarily used for iOS app development?",
    "options": ["Java", "Swift", "Python", "Kotlin"],
    "answer": "Swift"
  },
  {
    "question": "What design pattern is most commonly used in iOS development?",
    "options": ["Singleton", "Decorator", "MVC", "Proxy"],
    "answer": "MVC"
  },
  {
    "question": "Which of these is a core machine learning framework by Apple?",
    "options": ["TensorFlow", "PyTorch", "CoreML", "MLKit"],
    "answer": "CoreML"
  },
  {
    "question": "Which tool is used for developing Apple applications?",
    "options": ["Android Studio", "Visual Studio", "Eclipse", "Xcode"],
    "answer": "Xcode"
  },
  {
    "question": "What is the main purpose of Auto Layout in iOS?",
    "options": ["Handling animations", "Managing background tasks", "Creating responsive UI layouts", "Debugging UI bugs"],
    "answer": "Creating responsive UI layouts"
  },
  {
    "question": "Which of the following Apple devices uses macOS?",
    "options": ["iPad", "iPhone", "Apple Watch", "MacBook"],
    "answer": "MacBook"
  },
  {
    "question": "What is the purpose of the App Store Connect platform?",
    "options": ["Managing app downloads", "Reviewing user feedback", "Submitting and managing iOS apps", "Debugging application code"],
    "answer": "Submitting and managing iOS apps"
  },
  {
    "question": "Which framework would you use to integrate augmented reality in an iOS app?",
    "options": ["AVFoundation", "ARKit", "SpriteKit", "CoreData"],
    "answer": "ARKit"
  },
  {
    "question": "In iOS, what is a “delegate”?",
    "options": ["A design pattern for user authentication", "An object that handles network connections", "A mechanism for one object to communicate back to another", "A function used for UI design"],
    "answer": "A mechanism for one object to communicate back to another"
  },
  {
    "question": "What is the purpose of the @IBOutlet keyword in Swift?",
    "options": ["To declare a Swift package", "To connect a UI element to code", "To perform data encryption", "To import external libraries"],
    "answer": "To connect a UI element to code"
  },
  {
    "question": "Which of the following best describes Apple’s core design philosophy?",
    "options": ["Function over form", "Minimalism and user-centered design", "Heavy customization", "Open source accessibility"],
    "answer": "Minimalism and user-centered design"
  },
  {
    "question": "Apple emphasizes which of the following in its team environment?",
    "options": ["Competitive individual performance", "Strict hierarchy", "Collaboration and innovation", "Outsourcing development"],
    "answer": "Collaboration and innovation"
  },
  {
    "question": "Which Apple product introduced Face ID for the first time?",
    "options": ["iPhone 6", "iPhone 8", "iPhone X", "iPhone SE"],
    "answer": "iPhone X"
  },
  {
    "question": "Apple was co-founded by Steve Jobs, Steve Wozniak, and...?",
    "options": ["Tim Cook", "Bill Gates", "Ronald Wayne", "Jeff Bezos"],
    "answer": "Ronald Wayne"
  },
  {
    "question": "Apple’s M-series chips are built on what architecture?",
    "options": ["x86", "ARM", "RISC-V", "MIPS"],
    "answer": "ARM"
  },
  {
    "question": "What is Apple's cloud storage service called?",
    "options": ["Google Drive", "iStore", "iCloud", "Apple Disk"],
    "answer": "iCloud"
  },
  {
    "question": "What is the role of the Apple Human Interface Guidelines?",
    "options": ["To define app performance requirements", "To ensure apps follow UI/UX best practices", "To document hardware specs", "To help publish books on Apple Books"],
    "answer": "To ensure apps follow UI/UX best practices"
  },
  {
    "question": "What’s the function of TestFlight in the Apple developer ecosystem?",
    "options": ["Cloud file sharing", "Ad platform", "Beta app testing and feedback", "Security monitoring"],
    "answer": "Beta app testing and feedback"
  },
  {
    "question": "Which of the following is NOT a core Apple product line?",
    "options": ["Mac", "iPhone", "Apple Glass", "Apple Watch"],
    "answer": "Apple Glass"
  },
  {
    "question": "Which Apple executive is known for being the CEO after Steve Jobs?",
    "options": ["Craig Federighi", "Tim Cook", "Phil Schiller", "Elon Musk"],
    "answer": "Tim Cook"
  }
];


// --- Google ---
const googleQuestions = [
  {
    "question": "What data structure uses LIFO (Last In First Out) order?",
    "options": ["Queue", "Stack", "Array", "Linked List"],
    "answer": "Stack"
  },
  {
    "question": "What is the time complexity of binary search?",
    "options": ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
    "answer": "O(log n)"
  },
  {
    "question": "Which sorting algorithm is considered the fastest in practice for average cases?",
    "options": ["Bubble Sort", "Merge Sort", "Quick Sort", "Selection Sort"],
    "answer": "Quick Sort"
  },
  {
    "question": "What is the output of 5 + '5' in JavaScript?",
    "options": ["10", "55", "NaN", "Error"],
    "answer": "55"
  },
  {
    "question": "What design pattern ensures only one instance of a class is created?",
    "options": ["Factory", "Observer", "Singleton", "Decorator"],
    "answer": "Singleton"
  },
  {
    "question": "Which HTTP method is idempotent?",
    "options": ["POST", "PUT", "DELETE", "GET"],
    "answer": "GET"
  },
  {
    "question": "What is the maximum number of children a binary tree node can have?",
    "options": ["1", "2", "3", "Unlimited"],
    "answer": "2"
  },
  {
    "question": "Which of the following is a NoSQL database?",
    "options": ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    "answer": "MongoDB"
  },
  {
    "question": "What is the result of 0.1 + 0.2 === 0.3 in JavaScript?",
    "options": ["true", "false", "NaN", "undefined"],
    "answer": "false"
  },
  {
    "question": "Which of these is NOT a programming paradigm?",
    "options": ["Object-oriented", "Functional", "Procedural", "Linear"],
    "answer": "Linear"
  },
  {
    "question": "What does API stand for?",
    "options": ["Application Programming Interface", "Advanced Programming Interface", "Application Processing Interface", "Automated Program Interface"],
    "answer": "Application Programming Interface"
  },
  {
    "question": "What is a closure in JavaScript?",
    "options": [
      "A function having access to the parent scope",
      "An object containing other objects",
      "A method to define classes",
      "A way to loop through arrays"
    ],
    "answer": "A function having access to the parent scope"
  },
  {
    "question": "Which sorting algorithm is stable?",
    "options": ["Heap Sort", "Merge Sort", "Quick Sort", "Selection Sort"],
    "answer": "Merge Sort"
  },
  {
    "question": "What does the 'this' keyword refer to in a regular function in JavaScript?",
    "options": ["Global object", "Current object", "Window object", "Parent function"],
    "answer": "Global object"
  },
  {
    "question": "Which language is used for styling web pages?",
    "options": ["HTML", "JQuery", "CSS", "XML"],
    "answer": "CSS"
  },
  {
    "question": "Which of these is a frontend JavaScript framework?",
    "options": ["Node.js", "Django", "React", "Flask"],
    "answer": "React"
  },
  {
    "question": "What is the main function of the OSI Model Layer 3?",
    "options": ["Routing", "Data Encoding", "Physical Transmission", "Session Management"],
    "answer": "Routing"
  },
  {
    "question": "Which command is used to initialize a new Git repository?",
    "options": ["git start", "git begin", "git init", "git create"],
    "answer": "git init"
  },
  {
    "question": "Which type of machine learning is used when the data is unlabeled?",
    "options": ["Supervised", "Unsupervised", "Reinforcement", "Deep Learning"],
    "answer": "Unsupervised"
  },
  {
    "question": "What is a primary key in databases?",
    "options": [
      "A unique identifier for a record",
      "A shared key among tables",
      "A foreign identifier",
      "A default value"
    ],
    "answer": "A unique identifier for a record"
  }
];


// --- Microsoft ---
const microsoftQuestions = [
  {
    "question": "What is the time complexity of inserting an element into a HashMap?",
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "answer": "O(1)"
  },
  {
    "question": "What is the use of virtual functions in C++?",
    "options": ["For memory allocation", "To support polymorphism", "To reduce code size", "To compile faster"],
    "answer": "To support polymorphism"
  },
  {
    "question": "Which C# keyword is used to define a method that can be overridden?",
    "options": ["virtual", "override", "static", "sealed"],
    "answer": "virtual"
  },
  {
    "question": "In object-oriented programming, what does encapsulation mean?",
    "options": [
      "Binding data and methods together",
      "Using inheritance to reuse code",
      "Hiding implementation details",
      "Overloading functions"
    ],
    "answer": "Binding data and methods together"
  },
  {
    "question": "Which data structure is best for implementing LRU cache?",
    "options": ["Stack", "Queue", "HashMap + Doubly Linked List", "Heap"],
    "answer": "HashMap + Doubly Linked List"
  },
  {
    "question": "What is the space complexity of a recursive Fibonacci implementation?",
    "options": ["O(1)", "O(n)", "O(log n)", "O(2^n)"],
    "answer": "O(n)"
  },
  {
    "question": "Which of the following sorting algorithms is NOT comparison based?",
    "options": ["Quick Sort", "Merge Sort", "Heap Sort", "Counting Sort"],
    "answer": "Counting Sort"
  },
  {
    "question": "Which algorithm is used for shortest path in a weighted graph?",
    "options": ["Prim's", "Kruskal's", "Dijkstra's", "Bellman-Ford"],
    "answer": "Dijkstra's"
  },
  {
    "question": "In multithreading, what is a race condition?",
    "options": [
      "When threads finish at the same time",
      "When multiple threads update shared data concurrently",
      "When one thread depends on another",
      "When a thread is blocked forever"
    ],
    "answer": "When multiple threads update shared data concurrently"
  },
  {
    "question": "Which design pattern provides a way to access the elements of an aggregate object sequentially without exposing its underlying structure?",
    "options": ["Factory", "Observer", "Iterator", "Builder"],
    "answer": "Iterator"
  },
  {
    "question": "What is a deadlock in operating systems?",
    "options": [
      "When a process runs endlessly",
      "When multiple processes wait for each other indefinitely",
      "When CPU is idle",
      "When memory is insufficient"
    ],
    "answer": "When multiple processes wait for each other indefinitely"
  },
  {
    "question": "Which SQL command is used to remove duplicates in a result set?",
    "options": ["SELECT", "DISTINCT", "UNIQUE", "FILTER"],
    "answer": "DISTINCT"
  },
  {
    "question": "What is the default access modifier in a C# class?",
    "options": ["public", "private", "protected", "internal"],
    "answer": "private"
  },
  {
    "question": "Which Microsoft product is a cloud computing platform?",
    "options": ["Azure", "Windows Server", "Visual Studio", "Outlook"],
    "answer": "Azure"
  },
  {
    "question": "Which of these is a core principle of Agile methodology?",
    "options": ["Strict documentation", "Customer collaboration", "Monthly deployment", "No testing"],
    "answer": "Customer collaboration"
  },
  {
    "question": "What is the use of the 'ref' keyword in C#?",
    "options": [
      "To define a reference type",
      "To pass parameters by reference",
      "To avoid null exceptions",
      "To mark a function"
    ],
    "answer": "To pass parameters by reference"
  },
  {
    "question": "Which of the following is a Microsoft-developed language?",
    "options": ["Java", "Python", "C#", "Ruby"],
    "answer": "C#"
  },
  {
    "question": "What kind of tree is used in database indexing?",
    "options": ["Binary Tree", "AVL Tree", "B-Tree", "Heap"],
    "answer": "B-Tree"
  },
  {
    "question": "Which of the following is a benefit of garbage collection in .NET?",
    "options": [
      "Manual memory management",
      "Faster program execution",
      "Automatic memory release",
      "Increased file size"
    ],
    "answer": "Automatic memory release"
  },
  {
    "question": "What is the base class of all exceptions in C#?",
    "options": ["System.Error", "System.Exception", "BaseException", "System.Base"],
    "answer": "System.Exception"
  }
];


// --- Amazon ---
const amazonQuestions = [
  {
    "question": "What is the best data structure to implement a priority queue?",
    "options": ["Stack", "Queue", "Heap", "Linked List"],
    "answer": "Heap"
  },
  {
    "question": "Which sorting algorithm has the best average time complexity?",
    "options": ["Bubble Sort", "Quick Sort", "Insertion Sort", "Selection Sort"],
    "answer": "Quick Sort"
  },
  {
    "question": "What does the two-pointer technique help solve?",
    "options": [
      "Graph traversal",
      "Array manipulation problems like pair sum",
      "Database joins",
      "Hashing problems"
    ],
    "answer": "Array manipulation problems like pair sum"
  },
  {
    "question": "What is a hash collision?",
    "options": [
      "When a hash table is full",
      "When two keys have the same hash value",
      "When keys are not inserted",
      "When hash values are prime"
    ],
    "answer": "When two keys have the same hash value"
  },
  {
    "question": "Which data structure is most efficient for implementing an LRU cache?",
    "options": ["Stack", "Queue", "HashMap + Doubly Linked List", "TreeMap"],
    "answer": "HashMap + Doubly Linked List"
  },
  {
    "question": "What is the space complexity of merge sort?",
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "answer": "O(n)"
  },
  {
    "question": "Which algorithm is used for cycle detection in a graph?",
    "options": ["BFS", "DFS", "Dijkstra's", "Kruskal's"],
    "answer": "DFS"
  },
  {
    "question": "Which technique is best for solving dynamic programming problems?",
    "options": ["Divide and conquer", "Backtracking", "Memoization", "Recursion only"],
    "answer": "Memoization"
  },
  {
    "question": "Which of the following is *NOT* an Amazon Leadership Principle?",
    "options": ["Customer Obsession", "Dive Deep", "Bias for Action", "Always Be Closing"],
    "answer": "Always Be Closing"
  },
  {
    "question": "What is the Big O time complexity of searching in a balanced binary search tree?",
    "options": ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    "answer": "O(log n)"
  },
  {
    "question": "Which operation is fastest in a hash table?",
    "options": ["Insert", "Search", "Delete", "All of the above"],
    "answer": "All of the above"
  },
  {
    "question": "What should you do if you discover a bug in a critical system before a product launch?",
    "options": [
      "Ignore it",
      "Fix it only if time permits",
      "Raise it to the team and prioritize the fix",
      "Blame someone else"
    ],
    "answer": "Raise it to the team and prioritize the fix"
  },
  {
    "question": "What’s the first step in designing a scalable system?",
    "options": ["Writing code", "Drawing UI", "Understanding requirements and use cases", "Testing"],
    "answer": "Understanding requirements and use cases"
  },
  {
    "question": "Which of these is a depth-first traversal method?",
    "options": ["BFS", "DFS", "Topological Sort", "Greedy Search"],
    "answer": "DFS"
  },
  {
    "question": "Which Amazon principle does this behavior reflect: taking responsibility for your mistakes?",
    "options": ["Customer Obsession", "Earn Trust", "Think Big", "Invent and Simplify"],
    "answer": "Earn Trust"
  },
  {
    "question": "Which data structure allows O(1) access to the middle element?",
    "options": ["Array", "Queue", "Linked List", "Stack"],
    "answer": "Array"
  },
  {
    "question": "What’s the best way to handle large datasets that cannot fit into memory?",
    "options": [
      "Load everything anyway",
      "Use pagination or chunk processing",
      "Use linked lists",
      "Sort them manually"
    ],
    "answer": "Use pagination or chunk processing"
  },
  {
    "question": "What is a good use-case for using a Trie data structure?",
    "options": ["Pathfinding", "Prefix search", "Sorting numbers", "Stack operations"],
    "answer": "Prefix search"
  },
  {
    "question": "Which leadership principle is most aligned with experimenting and taking risks?",
    "options": ["Invent and Simplify", "Hire and Develop the Best", "Insist on the Highest Standards", "Are Right, A Lot"],
    "answer": "Invent and Simplify"
  },
  {
    "question": "What is the best approach for removing duplicates from a list in Python?",
    "options": ["Using list.remove()", "Using a for loop", "Converting to a set", "Using map()"],
    "answer": "Converting to a set"
  }
];

// --- Facebook ---
const facebookQuestions = [
  {
    "question": "What data structure is commonly used to implement DFS (Depth First Search)?",
    "options": ["Queue", "Stack", "Heap", "Linked List"],
    "answer": "Stack"
  },
  {
    "question": "Which algorithm is used to find the shortest path in a graph with negative weights?",
    "options": ["Dijkstra's", "Prim's", "Bellman-Ford", "Kruskal's"],
    "answer": "Bellman-Ford"
  },
  {
    "question": "What is the time complexity of inserting into a Binary Search Tree (average case)?",
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "answer": "O(log n)"
  },
  {
    "question": "Which sorting algorithm is considered stable?",
    "options": ["Merge Sort", "Heap Sort", "Quick Sort", "Selection Sort"],
    "answer": "Merge Sort"
  },
  {
    "question": "Which of the following is used for detecting cycles in a directed graph?",
    "options": ["DFS with recursion stack", "BFS", "Kruskal’s Algorithm", "Topological Sort only"],
    "answer": "DFS with recursion stack"
  },
  {
    "question": "What is a typical use case for a Trie?",
    "options": ["Sorting numbers", "Graph traversal", "Prefix-based search", "Binary tree balancing"],
    "answer": "Prefix-based search"
  },
  {
    "question": "Which of these data structures allows O(1) average time complexity for insert, delete, and search?",
    "options": ["Array", "Linked List", "Hash Table", "Heap"],
    "answer": "Hash Table"
  },
  {
    "question": "Which design principle encourages breaking down problems into independent pieces?",
    "options": ["DRY", "Separation of Concerns", "Encapsulation", "Inheritance"],
    "answer": "Separation of Concerns"
  },
  {
    "question": "What does Big O notation represent?",
    "options": [
      "Exact runtime of a program",
      "Worst-case time/space complexity",
      "Number of test cases",
      "Memory address"
    ],
    "answer": "Worst-case time/space complexity"
  },
  {
    "question": "Which programming paradigm is most commonly used in system design?",
    "options": ["Functional", "Object-Oriented", "Procedural", "Logic"],
    "answer": "Object-Oriented"
  },
  {
    "question": "What is memoization?",
    "options": [
      "Storing results of expensive function calls",
      "Loop unrolling",
      "Recursive tree traversal",
      "Code compilation optimization"
    ],
    "answer": "Storing results of expensive function calls"
  },
  {
    "question": "How would you reverse a linked list?",
    "options": [
      "Use a stack",
      "Swap data in nodes",
      "Iteratively change pointers",
      "Convert to array and reverse"
    ],
    "answer": "Iteratively change pointers"
  },
  {
    "question": "What is the core principle behind functional programming?",
    "options": ["Mutability", "Shared state", "Immutability", "Loops"],
    "answer": "Immutability"
  },
  {
    "question": "Which Facebook core value encourages engineers to move fast and try things?",
    "options": ["Be Bold", "Respect Time", "Design for All", "Perfection First"],
    "answer": "Be Bold"
  },
  {
    "question": "Which technique helps to detect and resolve concurrency issues?",
    "options": ["Hashing", "Memoization", "Locks and Semaphores", "Bit Manipulation"],
    "answer": "Locks and Semaphores"
  },
  {
    "question": "What is the purpose of a load balancer in a system?",
    "options": [
      "Improve UI performance",
      "Distribute traffic across multiple servers",
      "Store backup data",
      "Log user sessions"
    ],
    "answer": "Distribute traffic across multiple servers"
  },
  {
    "question": "What is the time complexity of checking if a string is a palindrome?",
    "options": ["O(n)", "O(n^2)", "O(log n)", "O(1)"],
    "answer": "O(n)"
  },
  {
    "question": "Which algorithm finds strongly connected components in a graph?",
    "options": ["Dijkstra's", "Kosaraju's", "Prim's", "Kruskal's"],
    "answer": "Kosaraju's"
  },
  {
    "question": "Which Facebook product was originally created for internal use before going public?",
    "options": ["Facebook Live", "React", "Instagram", "Messenger"],
    "answer": "React"
  },
  {
    "question": "What is the best way to avoid duplicate entries in a collection?",
    "options": ["List", "Array", "HashSet", "Queue"],
    "answer": "HashSet"
  }
];


// --- Netflix ---
const netflixQuestions = [
  {
    "question": "Which data structure is most efficient for implementing a real-time streaming queue?",
    "options": ["Array", "Stack", "Linked List", "Queue"],
    "answer": "Queue"
  },
  {
    "question": "Which algorithm is commonly used for recommendation systems like Netflix's 'Suggested for You'?",
    "options": ["Naive Bayes", "Collaborative Filtering", "Decision Trees", "K-Means Clustering"],
    "answer": "Collaborative Filtering"
  },
  {
    "question": "What is the time complexity of accessing an element in a HashMap?",
    "options": ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    "answer": "O(1)"
  },
  {
    "question": "What is the main purpose of using microservices in scalable applications?",
    "options": [
      "To reduce security issues",
      "To deploy all services together",
      "To enable independent development and scaling",
      "To use one programming language"
    ],
    "answer": "To enable independent development and scaling"
  },
  {
    "question": "Which Netflix technology is used to simulate failures in production?",
    "options": ["FailFast", "Chaos Monkey", "SimFail", "Black Swan"],
    "answer": "Chaos Monkey"
  },
  {
    "question": "What does CDN stand for, a core part of Netflix's streaming architecture?",
    "options": ["Content Distribution Network", "Central Database Network", "Custom Data Node", "Core Device Network"],
    "answer": "Content Distribution Network"
  },
  {
    "question": "Which programming language is widely used at Netflix for backend services?",
    "options": ["C#", "Go", "Java", "PHP"],
    "answer": "Java"
  },
  {
    "question": "Which of these is a key system design principle used in Netflix’s architecture?",
    "options": ["Vertical Scaling", "Strong Coupling", "Event-Driven Architecture", "Single Point of Failure"],
    "answer": "Event-Driven Architecture"
  },
  {
    "question": "What is the goal of A/B testing at Netflix?",
    "options": [
      "Test UI performance",
      "Compare two versions and measure user response",
      "Fix bugs",
      "Measure backend latency"
    ],
    "answer": "Compare two versions and measure user response"
  },
  {
    "question": "Which database system is commonly used for distributed data at Netflix?",
    "options": ["MySQL", "Oracle", "PostgreSQL", "Cassandra"],
    "answer": "Cassandra"
  },
  {
    "question": "Which principle from the Netflix culture deck emphasizes taking ownership?",
    "options": ["Curiosity", "Freedom and Responsibility", "Collaboration", "Kindness"],
    "answer": "Freedom and Responsibility"
  },
  {
    "question": "How does Netflix ensure high availability in its services?",
    "options": [
      "Monolithic architecture",
      "Single regional servers",
      "Multi-region cloud deployments with redundancy",
      "Use of local hard drives"
    ],
    "answer": "Multi-region cloud deployments with redundancy"
  },
  {
    "question": "What is a circuit breaker in microservices design?",
    "options": [
      "A device to cut electricity",
      "A pattern that stops calls to a failing service",
      "A service restarter",
      "A request queue manager"
    ],
    "answer": "A pattern that stops calls to a failing service"
  },
  {
    "question": "Which caching strategy is commonly used for reducing latency?",
    "options": ["LRU", "MRU", "FIFO", "Random"],
    "answer": "LRU"
  },
  {
    "question": "Which metric is most relevant when measuring streaming quality at Netflix?",
    "options": ["Page load time", "Bitrate", "Bounce rate", "CPU usage"],
    "answer": "Bitrate"
  },
  {
    "question": "How often do you seek feedback and improve, according to Netflix values?",
    "options": ["Only during reviews", "Only when things go wrong", "Regularly and proactively", "Never"],
    "answer": "Regularly and proactively"
  },
  {
    "question": "What is the role of Kafka in Netflix architecture?",
    "options": [
      "Frontend rendering",
      "Data encryption",
      "Message streaming and logging",
      "UI personalization"
    ],
    "answer": "Message streaming and logging"
  },
  {
    "question": "What type of sorting algorithm is best for nearly sorted data?",
    "options": ["Merge Sort", "Heap Sort", "Bubble Sort", "Insertion Sort"],
    "answer": "Insertion Sort"
  },
  {
    "question": "Which principle is *not* part of Netflix's core values?",
    "options": ["Integrity", "Excellence", "Speed over quality", "Innovation"],
    "answer": "Speed over quality"
  },
  {
    "question": "What is the best way to handle failure in a distributed system?",
    "options": ["Ignore it", "Retry with backoff and alerting", "Restart the server", "Log and delay"],
    "answer": "Retry with backoff and alerting"
  }
];


// --- Adobe ---
const adobeQuestions = [
  {
    "question": "Which data structure is ideal for implementing undo functionality in Adobe software?",
    "options": ["Queue", "Stack", "Array", "Linked List"],
    "answer": "Stack"
  },
  {
    "question": "What is the time complexity of inserting an element in a Binary Search Tree (average case)?",
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "answer": "O(log n)"
  },
  {
    "question": "Which sorting algorithm is stable and has O(n log n) complexity?",
    "options": ["Quick Sort", "Heap Sort", "Merge Sort", "Bubble Sort"],
    "answer": "Merge Sort"
  },
  {
    "question": "What is the main benefit of Object-Oriented Programming (OOP)?",
    "options": [
      "Slower execution",
      "Code duplication",
      "Modularity and reusability",
      "No debugging required"
    ],
    "answer": "Modularity and reusability"
  },
  {
    "question": "Which algorithm helps in detecting a loop in a linked list?",
    "options": ["Dijkstra's", "Floyd's Cycle Detection", "Prim's", "Binary Search"],
    "answer": "Floyd's Cycle Detection"
  },
  {
    "question": "Which Adobe product is primarily used for designing vector graphics?",
    "options": ["Photoshop", "Lightroom", "Illustrator", "Premiere Pro"],
    "answer": "Illustrator"
  },
  {
    "question": "Which data structure provides fast lookup of key-value pairs?",
    "options": ["Array", "Queue", "Hash Map", "Stack"],
    "answer": "Hash Map"
  },
  {
    "question": "What is a constructor in OOP?",
    "options": [
      "A function to delete a class",
      "A method used to initialize an object",
      "A method that runs after a program ends",
      "A loop control structure"
    ],
    "answer": "A method used to initialize an object"
  },
  {
    "question": "Which design pattern is used when a class wants to ensure only one instance exists?",
    "options": ["Factory", "Observer", "Decorator", "Singleton"],
    "answer": "Singleton"
  },
  {
    "question": "Which Adobe product is widely used for professional photo editing?",
    "options": ["Illustrator", "Premiere Pro", "Photoshop", "Dreamweaver"],
    "answer": "Photoshop"
  },
  {
    "question": "Which traversal technique visits the left subtree, then node, then right subtree?",
    "options": ["Preorder", "Inorder", "Postorder", "Level-order"],
    "answer": "Inorder"
  },
  {
    "question": "Which feature of Adobe's culture encourages employees to share new product ideas?",
    "options": ["Code freeze", "Adobe Kickbox", "Silent Mondays", "Pixel Vault"],
    "answer": "Adobe Kickbox"
  },
  {
    "question": "What is the best data structure to implement a browser's forward and back buttons?",
    "options": ["Stack", "Queue", "Linked List", "Hash Map"],
    "answer": "Stack"
  },
  {
    "question": "Which algorithm is best for finding the shortest path in a weighted graph with non-negative weights?",
    "options": ["Kruskal's", "DFS", "Dijkstra's", "Bellman-Ford"],
    "answer": "Dijkstra's"
  },
  {
    "question": "What does encapsulation in OOP promote?",
    "options": ["Public access to all variables", "Data hiding", "Multiple inheritance", "Global variables"],
    "answer": "Data hiding"
  },
  {
    "question": "Which language is primarily used for Adobe After Effects scripting?",
    "options": ["Java", "Python", "JavaScript", "C++"],
    "answer": "JavaScript"
  },
  {
    "question": "Which algorithm is used to sort elements in nearly sorted arrays efficiently?",
    "options": ["Merge Sort", "Bubble Sort", "Insertion Sort", "Heap Sort"],
    "answer": "Insertion Sort"
  },
  {
    "question": "How does Adobe support innovation internally?",
    "options": [
      "Weekly code reviews only",
      "Strict control of ideas",
      "Adobe Kickbox program",
      "No changes to existing tools"
    ],
    "answer": "Adobe Kickbox program"
  },
  {
    "question": "Which principle in software design is related to 'Separation of Concerns'?",
    "options": ["Tight coupling", "Single Responsibility Principle", "Inheritance", "Encapsulation"],
    "answer": "Single Responsibility Principle"
  },
  {
    "question": "What is the space complexity of a recursive binary search?",
    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    "answer": "O(log n)"
  }
];


// --- Intel ---
const intelQuestions =[
  {
    "question": "Which data structure is most suitable for implementing a priority queue?",
    "options": ["Stack", "Queue", "Heap", "Linked List"],
    "answer": "Heap"
  },
  {
    "question": "Which sorting algorithm has the best average-case performance?",
    "options": ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    "answer": "Merge Sort"
  },
  {
    "question": "What does CPU stand for?",
    "options": ["Central Processing Unit", "Core Performance Unit", "Computer Program Unit", "Control Processing Unit"],
    "answer": "Central Processing Unit"
  },
  {
    "question": "Which language is primarily used for low-level hardware interaction?",
    "options": ["Python", "C++", "Java", "Assembly"],
    "answer": "Assembly"
  },
  {
    "question": "What is the primary function of a cache in a processor?",
    "options": [
      "Store user data",
      "Store operating system",
      "Speed up memory access",
      "Increase disk space"
    ],
    "answer": "Speed up memory access"
  },
  {
    "question": "Which of the following is *not* a type of cache?",
    "options": ["L1", "L2", "L3", "L4"],
    "answer": "L4"
  },
  {
    "question": "Which OS concept helps manage multiple processes on a CPU?",
    "options": ["Paging", "Threading", "Scheduling", "Spooling"],
    "answer": "Scheduling"
  },
  {
    "question": "What is a deadlock in operating systems?",
    "options": [
      "A situation where CPU is overloaded",
      "A virus attack",
      "Processes waiting for each other indefinitely",
      "File not found error"
    ],
    "answer": "Processes waiting for each other indefinitely"
  },
  {
    "question": "Which data structure is best for implementing recursion?",
    "options": ["Queue", "Array", "Stack", "HashMap"],
    "answer": "Stack"
  },
  {
    "question": "Which Intel technology is designed for enhancing virtualization?",
    "options": ["Intel VT-x", "Intel Turbo Boost", "Intel Quick Sync", "Intel HT"],
    "answer": "Intel VT-x"
  },
  {
    "question": "What is the output of 4 >> 1 in C?",
    "options": ["8", "2", "1", "4"],
    "answer": "2"
  },
  {
    "question": "Which principle is crucial when writing embedded software for Intel chips?",
    "options": ["High latency", "Memory efficiency", "Large code size", "Loose typing"],
    "answer": "Memory efficiency"
  },
  {
    "question": "What is the size of an int on a 64-bit Intel processor (typically)?",
    "options": ["2 bytes", "4 bytes", "8 bytes", "16 bytes"],
    "answer": "4 bytes"
  },
  {
    "question": "What does MMU stand for in Intel architecture?",
    "options": ["Main Memory Unit", "Memory Management Unit", "Mass Memory Utility", "Machine Map Utility"],
    "answer": "Memory Management Unit"
  },
  {
    "question": "What is pipelining in processor design?",
    "options": [
      "Downloading software updates",
      "Parallel execution of instructions in different stages",
      "Error correction mechanism",
      "Creating network pipelines"
    ],
    "answer": "Parallel execution of instructions in different stages"
  },
  {
    "question": "Which bitwise operator is used for masking?",
    "options": ["|", "&", "^", "~"],
    "answer": "&"
  },
  {
    "question": "Which Intel hardware feature helps prevent buffer overflow attacks?",
    "options": ["VT-x", "HyperThreading", "NX Bit", "Quick Sync"],
    "answer": "NX Bit"
  },
  {
    "question": "Which of these is a behavioral trait Intel looks for?",
    "options": ["Ignoring details", "Being reactive", "Driving innovation", "Avoiding feedback"],
    "answer": "Driving innovation"
  },
  {
    "question": "What is the key reason for using multi-core processors?",
    "options": [
      "Higher clock speed",
      "Better cooling",
      "Parallel task execution",
      "Lower voltage"
    ],
    "answer": "Parallel task execution"
  },
  {
    "question": "What is the full form of BIOS?",
    "options": ["Basic Input Output System", "Binary Input Output Setup", "Base Internet OS", "Basic Integrated OS"],
    "answer": "Basic Input Output System"
  }
];


// --- Tesla ---
const teslaQuestions = [
  {
    "question": "Which data structure is ideal for scheduling tasks with priorities in embedded systems?",
    "options": ["Queue", "Stack", "Heap", "Hash Map"],
    "answer": "Heap"
  },
  {
    "question": "What does CAN in 'CAN bus' stand for?",
    "options": ["Controller Area Network", "Central Automotive Node", "Car Access Network", "Control Actuator Node"],
    "answer": "Controller Area Network"
  },
  {
    "question": "Which programming language is most commonly used in embedded systems?",
    "options": ["Python", "Java", "C", "Swift"],
    "answer": "C"
  },
  {
    "question": "Which algorithm is best for path planning in autonomous vehicles?",
    "options": ["Bubble Sort", "Dijkstra’s Algorithm", "Binary Search", "Kruskal’s Algorithm"],
    "answer": "Dijkstra’s Algorithm"
  },
  {
    "question": "Which Tesla vehicle was the first to feature Full Self-Driving beta software?",
    "options": ["Model 3", "Model Y", "Model S", "Model X"],
    "answer": "Model 3"
  },
  {
    "question": "What is the time complexity of searching in a balanced binary search tree?",
    "options": ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    "answer": "O(log n)"
  },
  {
    "question": "Which of the following is an electric vehicle (EV) battery type used by Tesla?",
    "options": ["NiCd", "Lead Acid", "Solid-State", "Lithium-ion"],
    "answer": "Lithium-ion"
  },
  {
    "question": "What is the purpose of regenerative braking in Tesla cars?",
    "options": ["Heat up the engine", "Recharge the battery", "Cool down the motor", "Boost acceleration"],
    "answer": "Recharge the battery"
  },
  {
    "question": "What does Elon Musk consider the biggest manufacturing challenge?",
    "options": ["Selling cars", "Shipping logistics", "Production ramp-up", "Designing batteries"],
    "answer": "Production ramp-up"
  },
  {
    "question": "Which sensor is *not* typically used in Tesla's Autopilot hardware?",
    "options": ["Ultrasonic", "Radar", "Camera", "LiDAR"],
    "answer": "LiDAR"
  },
  {
    "question": "Which Tesla product provides energy storage for homes?",
    "options": ["Model 3", "Powerwall", "Roadster", "Supercharger"],
    "answer": "Powerwall"
  },
  {
    "question": "What is multithreading used for in Tesla vehicle software?",
    "options": ["Storing logs", "Handling multiple sensor streams", "Compressing images", "Battery testing"],
    "answer": "Handling multiple sensor streams"
  },
  {
    "question": "Which of these is a Tesla value Elon Musk emphasizes?",
    "options": ["Perfectionism", "Slow development", "Ownership and urgency", "Working in silos"],
    "answer": "Ownership and urgency"
  },
  {
    "question": "What is the best-case time complexity of Quick Sort?",
    "options": ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
    "answer": "O(n log n)"
  },
  {
    "question": "What is the main function of the Tesla Supercharger?",
    "options": ["Control autopilot", "Recharge vehicles quickly", "Diagnose issues", "Calibrate sensors"],
    "answer": "Recharge vehicles quickly"
  },
  {
    "question": "Which Tesla vehicle is a high-performance electric sports car?",
    "options": ["Model X", "Model 3", "Roadster", "Model Y"],
    "answer": "Roadster"
  },
  {
    "question": "In a real-time OS, which scheduling algorithm is most common?",
    "options": ["FIFO", "Round Robin", "Shortest Job First", "Priority Scheduling"],
    "answer": "Priority Scheduling"
  },
  {
    "question": "Which Tesla software team handles the user interface on the car touchscreen?",
    "options": ["Autopilot Team", "Infotainment Team", "Hardware Team", "Mechanical Team"],
    "answer": "Infotainment Team"
  },
  {
    "question": "Which of the following is a behavioral trait Tesla interviews often assess?",
    "options": ["Willingness to delay decisions", "Extreme ownership", "Lack of urgency", "Avoiding feedback"],
    "answer": "Extreme ownership"
  },
  {
    "question": "What does SoC stand for in Tesla chip architecture?",
    "options": ["Start of Configuration", "System on Chip", "Signal on Control", "Serial on CPU"],
    "answer": "System on Chip"
  }
];


// --- Salesforce ---
const salesforceQuestions = [
  {
    "question": "What is Apex in Salesforce?",
    "options": [
      "A data analysis tool",
      "A declarative tool",
      "A proprietary programming language used on Salesforce platform",
      "An automation engine"
    ],
    "answer": "A proprietary programming language used on Salesforce platform"
  },
  {
    "question": "Which data structure is ideal for mapping keys to values?",
    "options": ["Stack", "Queue", "HashMap", "Array"],
    "answer": "HashMap"
  },
  {
    "question": "What is a trigger in Salesforce?",
    "options": [
      "A report generator",
      "A workflow tool",
      "A piece of code that executes before or after DML operations",
      "A permission set"
    ],
    "answer": "A piece of code that executes before or after DML operations"
  },
  {
    "question": "What does SOQL stand for?",
    "options": ["Salesforce Object Query Language", "Simple Object Query Language", "Structured Object Query Language", "Salesforce Operational Query Logic"],
    "answer": "Salesforce Object Query Language"
  },
  {
    "question": "Which of the following is a component-based UI framework for developing dynamic web apps for mobile and desktop devices in Salesforce?",
    "options": ["Apex", "Visualforce", "Lightning Web Components", "Workflow"],
    "answer": "Lightning Web Components"
  },
  {
    "question": "Which Salesforce feature allows you to automate business processes?",
    "options": ["Dashboards", "Chatter", "Flow Builder", "Reports"],
    "answer": "Flow Builder"
  },
  {
    "question": "Which object is used to store information about users’ tasks and calendar events?",
    "options": ["Opportunity", "Account", "Activity", "User"],
    "answer": "Activity"
  },
  {
    "question": "What is the maximum number of triggers per object in Salesforce?",
    "options": ["1", "3", "5", "Unlimited"],
    "answer": "1"
  },
  {
    "question": "What is a governor limit in Salesforce?",
    "options": [
      "A restriction on the number of users",
      "A limit on API usage by customers",
      "Limits Salesforce enforces to ensure efficient processing and multi-tenancy",
      "An object visibility rule"
    ],
    "answer": "Limits Salesforce enforces to ensure efficient processing and multi-tenancy"
  },
  {
    "question": "Which Salesforce feature lets users see data visualizations from multiple sources?",
    "options": ["Flow Builder", "Apex Classes", "Einstein Analytics", "Reports"],
    "answer": "Einstein Analytics"
  },
  {
    "question": "What is a sandbox in Salesforce?",
    "options": [
      "A user role",
      "A test environment to develop and test applications",
      "A customer-facing app",
      "A schema builder"
    ],
    "answer": "A test environment to develop and test applications"
  },
  {
    "question": "Which HTTP method is used to update a resource in a REST API call?",
    "options": ["GET", "POST", "PUT", "DELETE"],
    "answer": "PUT"
  },
  {
    "question": "Which access modifier makes a method accessible only within the same class in Apex?",
    "options": ["public", "private", "protected", "global"],
    "answer": "private"
  },
  {
    "question": "What is the purpose of the 'with sharing' keyword in Apex?",
    "options": [
      "To allow sharing of Apex classes to other apps",
      "To enforce sharing rules of the current user",
      "To share logs with admins",
      "To override user permissions"
    ],
    "answer": "To enforce sharing rules of the current user"
  },
  {
    "question": "What type of relationship is used in Salesforce when a child object can only have one parent?",
    "options": ["Lookup Relationship", "Master-Detail Relationship", "Junction Object", "Self-relationship"],
    "answer": "Master-Detail Relationship"
  },
  {
    "question": "Which Salesforce tool is used to migrate metadata between environments?",
    "options": ["Workbench", "Data Loader", "Change Sets", "SOQL"],
    "answer": "Change Sets"
  },
  {
    "question": "What is a junction object in Salesforce?",
    "options": [
      "A record created by Flow",
      "A report configuration",
      "A custom object used to create many-to-many relationships",
      "An automation rule"
    ],
    "answer": "A custom object used to create many-to-many relationships"
  },
  {
    "question": "Which of the following is a declarative tool in Salesforce?",
    "options": ["Apex", "Visualforce", "Flow Builder", "REST API"],
    "answer": "Flow Builder"
  },
  {
    "question": "What is the purpose of Test classes in Apex?",
    "options": [
      "To handle exceptions",
      "To improve UI",
      "To validate Apex code and cover test scenarios",
      "To store user sessions"
    ],
    "answer": "To validate Apex code and cover test scenarios"
  },
  {
    "question": "Which trait is most valued during behavioral interviews at Salesforce?",
    "options": ["Disinterest in teamwork", "Speed without quality", "Customer-centric thinking", "Ignoring feedback"],
    "answer": "Customer-centric thinking"
  }
]


const companies = [
  "Apple",
  "Google",
  "Microsoft",
  "Amazon",
  "Facebook",
  "Netflix",
  "Adobe",
  "Intel",
  "Tesla",
  "Salesforce"
];

const companyQuestionsMap = {
  Apple: appleQuestions,
  Google: googleQuestions,
  Microsoft: microsoftQuestions,
  Amazon: amazonQuestions,
  Facebook: facebookQuestions,
  Netflix: netflixQuestions,
  Adobe: adobeQuestions,
  Intel: intelQuestions,
  Tesla: teslaQuestions,
  Salesforce: salesforceQuestions
};

const CompanyWiseQuestions = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const sounds = useSoundEffects();

  // Helper to get N random, non-repeating questions
  function getRandomQuestions(arr, n = 5) {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(n, arr.length));
  }

  React.useEffect(() => {
    if (selectedCompany) {
      const questions = companyQuestionsMap[selectedCompany];
      if (questions && questions.length > 0) {
        setRandomQuestions(getRandomQuestions(questions, 5));
      }
    }
  }, [selectedCompany]);

  if (!selectedCompany) {
    return (
      <div className="cwq-container">
        <div className="cwq-header">
          <h2 className="cwq-title">Select a Company</h2>
          <button
            className="cwq-sound-toggle"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) sounds.click();
            }}
            title={soundEnabled ? "Disable Sound Effects" : "Enable Sound Effects"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
        </div>
        <div className="cwq-company-list">
          {companies.map(company => (
            <button
              key={company}
              className="cwq-company-btn"
              onClick={() => {
                if (soundEnabled) sounds.click();
                setSelectedCompany(company);
              }}
              onMouseEnter={() => soundEnabled && sounds.hover()}
            >
              {company}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (randomQuestions && randomQuestions.length > 0) {
    return (
      <MCQTest
        questions={randomQuestions}
        company={selectedCompany}
        onBack={() => setSelectedCompany(null)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
    );
  }

  return (
    <div className="cwq-container text-center">
      <h2 className="cwq-title">{selectedCompany} Interview MCQ</h2>
      <p>Questions for {selectedCompany} are not available yet.</p>
      <button
        className="cwq-back-btn"
        onClick={() => setSelectedCompany(null)}
      >
        Back to Companies
      </button>
    </div>
  );
};

const MCQTest = ({ questions, company, onBack, soundEnabled, setSoundEnabled }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const sounds = useSoundEffects();

  const handleOptionClick = (option) => {
    if (soundEnabled) sounds.click();
    setSelected(option);
  };

  const handleNext = () => {
    const isCorrect = selected === questions[current].answer;

    // Play sound based on answer correctness
    if (isCorrect) {
      if (soundEnabled) sounds.correct();
      setScore(score + 1);
    } else {
      if (soundEnabled) sounds.wrong();
    }

    // Show feedback briefly
    setAnswerFeedback(isCorrect ? 'correct' : 'wrong');

    // Delay navigation to let user hear the feedback sound
    setTimeout(() => {
      setAnswerFeedback(null);
      setSelected(null);

      if (current < questions.length - 1) {
        if (soundEnabled) sounds.navigation();
        setCurrent(current + 1);
      } else {
        if (soundEnabled) sounds.completion();
        setShowScore(true);
      }
    }, 1000);
  };

  const handlePrev = () => {
    if (current > 0) {
      if (soundEnabled) sounds.navigation();
      setCurrent(current - 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    if (soundEnabled) sounds.click();
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setShowScore(false);
    setAnswerFeedback(null);
  };

  if (showScore) {
    return (
      <div className="cwq-container text-center">
        <h2 className="cwq-title">Test Completed!</h2>
        <p className="cwq-score">Your Score: {score} / {questions.length}</p>
        <button
          className="cwq-company-btn"
          onClick={handleRestart}
          onMouseEnter={() => soundEnabled && sounds.hover()}
        >
          Restart Test
        </button>
        <button
          className="cwq-back-btn"
          onClick={() => {
            if (soundEnabled) sounds.click();
            onBack();
          }}
          onMouseEnter={() => soundEnabled && sounds.hover()}
        >
          Back to Companies
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="cwq-container">
      <button className="cwq-back-btn" onClick={onBack}>
        Back to Companies
      </button>
      <h2 className="cwq-title">{company} Interview MCQ</h2>
      <div className={`cwq-question-card ${answerFeedback ? `feedback-${answerFeedback}` : ''}`}>
        <p className="cwq-question">{current + 1}. {q.question}</p>
        {answerFeedback && (
          <div className={`cwq-feedback ${answerFeedback}`}>
            {answerFeedback === 'correct' ? '✅ Correct!' : '❌ Wrong!'}
          </div>
        )}
        <ul className="cwq-options-list">
          {q.options.map((opt, idx) => (
            <li key={idx}>
              <button
                className={`cwq-option-btn${selected === opt ? ' selected' : ''}`}
                onClick={() => handleOptionClick(opt)}
                onMouseEnter={() => soundEnabled && sounds.hover()}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="cwq-nav-btns">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="cwq-nav-btn"
          onMouseEnter={() => soundEnabled && current !== 0 && sounds.hover()}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={selected === null}
          className="cwq-nav-btn primary"
          onMouseEnter={() => soundEnabled && selected !== null && sounds.hover()}
        >
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default CompanyWiseQuestions;