// ===== Code Craft — vanilla JS (no frameworks) =====

const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const navLinksWrap = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const toastEl = document.getElementById('toast');

let toastTimer = null;

/* ---------- Page routing ---------- *//* ==========================================================================
   Code Craft — complete site in one script: content data + behaviour.
   Plain JavaScript, no framework and no build step. Works with index.html
   and styles.css only.

   Sections
     1. config            2. content data        3. auth helpers
     4. theme + utilities 5. header & footer     6. view renderers
     7. practice & quiz   8. auth views          9. hash router
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------- 1. config -- */
  var CONFIG = {
    /* Fill in your Base44 app id so login, registration and password reset
       talk to the same auth backend as the hosted app. */
    appId: "YOUR_BASE44_APP_ID",
    /* Leave empty to use the domain this site is served from. */
    appBaseUrl: ""
  };

  /* --------------------------------------------------------- 2. content -- */
  var D = (function () {
    const modules = {
      "quantitative-aptitude": {
        id: "quantitative-aptitude",
        title: "Quantitative Aptitude",
        icon: "🧮",
        category: "Aptitude",
        categoryHref: "aptitude.html",
        description:
          "Practice quantitative aptitude, logical reasoning, verbal reasoning and data interpretation.",
        topics: [
          "Number System",
          "Percentage",
          "Profit & Loss",
          "Time & Work",
          "Time, Speed & Distance",
          "Probability",
        ],
      },
      "data-structures": {
        id: "data-structures",
        title: "Data Structures",
        icon: "🌳",
        category: "Programming",
        categoryHref: "programming.html",
        description:
          "Strengthen problem-solving skills with arrays, strings, stacks, queues, trees, hashing and more.",
        topics: [
          "Arrays",
          "Strings",
          "Stacks",
          "Queues",
          "Trees",
          "Hashing",
          "Linked Lists",
          "Graphs",
        ],
      },
      dbms: {
        id: "dbms",
        title: "DBMS",
        icon: "🗄️",
        category: "Core",
        categoryHref: "core.html",
        description:
          "Master database management systems — normalization, SQL, transactions, indexing and more.",
        topics: [
          "Normalization",
          "SQL Queries",
          "Transactions",
          "Indexing",
          "Joins",
          "ACID Properties",
          "ER Model",
          "Concurrency",
        ],
      },
      "hr-interview": {
        id: "hr-interview",
        title: "HR Interview",
        icon: "🎤",
        category: "HR",
        categoryHref: "hr.html",
        description:
          "Prepare for the HR round with frequently asked questions, model answers and structured responses.",
        topics: [
          "Tell me about yourself",
          "Strengths & weaknesses",
          "Why should we hire you?",
          "Where do you see yourself in 5 years?",
          "Why do you want to join our company?",
          "Describe a challenging situation you handled",
        ],
      },
    };

    const moduleContent = {
      "quantitative-aptitude": {
        overview:
          "Quantitative aptitude tests your numerical reasoning under time pressure and is the first filter in most placement drives. The section covers four families: arithmetic (percentages, profit and loss, time and work, speed and distance), number theory (number systems, LCM and HCF), logical reasoning, and data interpretation from charts and tables. Success comes from recognising the pattern behind each question and applying the shortest formula rather than attempting long calculations. Train yourself to convert every problem into a known template: identify what is asked, list the given values, pick the formula, then simplify using fractions and smart approximations. Speed matters as much as accuracy, because written rounds are scored against strict cut-offs. Regular timed practice builds the mental shortcuts and confidence that written rounds demand.",
        flowchart: {
          title: "How to Solve a Quantitative Aptitude Question",
          steps: [
            { title: "Read and Classify", detail: "Identify the topic: percentage, ratio, time and work, speed, or data interpretation." },
            { title: "Extract the Data", detail: "List every given value with its unit and note exactly what is being asked." },
            { title: "Choose the Formula", detail: "Match the problem to the standard template for that topic." },
            { title: "Convert to Fractions", detail: "Turn percentages and decimals into simple fractions to simplify faster." },
            { title: "Solve and Simplify", detail: "Cancel aggressively and approximate where the options allow." },
            { title: "Verify", detail: "Sanity-check the answer against the units and its rough magnitude." },
          ],
        },
        facts: [
          "Percentage change = (Difference / Original) × 100",
          "Speed = Distance ÷ Time",
          "Work and time are inversely proportional",
          "Profit % = (Profit ÷ Cost Price) × 100",
        ],
        mcqs: [
          { q: "A number increased by 20% becomes 96. What was the original number?", options: ["76", "80", "84", "88"], answer: 1, explanation: "x × 1.2 = 96, so x = 96 ÷ 1.2 = 80." },
          { q: "If the cost price is ₹400 and the selling price is ₹460, what is the profit percentage?", options: ["12%", "18%", "15%", "20%"], answer: 2, explanation: "Profit = 60. 60 ÷ 400 × 100 = 15%." },
          { q: "A can finish a job in 10 days and B in 15 days. Working together, how long will they take?", options: ["5 days", "7 days", "6 days", "8 days"], answer: 2, explanation: "1/10 + 1/15 = 1/6, so together they finish in 6 days." },
          { q: "A train covers 180 km in 3 hours. What is its speed in km/h?", options: ["60", "55", "50", "65"], answer: 0, explanation: "Speed = Distance ÷ Time = 180 ÷ 3 = 60 km/h." },
          { q: "What is the LCM of 12 and 18?", options: ["48", "72", "36", "24"], answer: 2, explanation: "12 = 2² × 3 and 18 = 2 × 3², so LCM = 2² × 3² = 36." },
          { q: "A shopkeeper marks an item 40% above cost and gives a 25% discount. What is the profit percentage?", options: ["5%", "10%", "15%", "20%"], answer: 0, explanation: "Let CP = 100, so MP = 140 and SP = 140 × 0.75 = 105. Profit = 5%." },
          { q: "If 3x + 5 = 20, what is the value of x?", options: ["3", "5", "4", "6"], answer: 1, explanation: "3x = 15, so x = 5." },
          { q: "The average of 5 numbers is 18. If the number 20 is removed, what is the new average?", options: ["16", "18", "17.5", "17"], answer: 2, explanation: "Total = 90. After removing 20, 70 ÷ 4 = 17.5." },
          { q: "A sum doubles in 8 years at simple interest. What is the annual rate?", options: ["10%", "15%", "12.5%", "20%"], answer: 2, explanation: "SI equals the principal in 8 years, so rate = 100 ÷ 8 = 12.5%." },
          { q: "Two dice are rolled. What is the probability that the sum is 7?", options: ["1/9", "1/6", "1/12", "5/36"], answer: 1, explanation: "6 favourable outcomes out of 36, so 6/36 = 1/6." },
        ],
        quizMcqs: [
          { q: "What is 15% of 240?", options: ["32", "36", "38", "42"], answer: 1, explanation: "0.15 × 240 = 36." },
          { q: "The ratio of boys to girls in a class of 40 is 3:2. How many girls are there?", options: ["16", "18", "20", "24"], answer: 0, explanation: "5 parts = 40, so one part = 8 and girls = 2 × 8 = 16." },
          { q: "One pipe fills a tank in 4 hours and another in 6 hours. Working together, how long will they take?", options: ["2 hours", "2.4 hours", "2.5 hours", "3 hours"], answer: 1, explanation: "1/4 + 1/6 = 5/12, so the time is 12/5 = 2.4 hours." },
          { q: "A car travels at 45 km/h for 2 hours. How far does it go?", options: ["80 km", "85 km", "90 km", "95 km"], answer: 2, explanation: "Distance = Speed × Time = 45 × 2 = 90 km." },
          { q: "What is the HCF of 24 and 36?", options: ["6", "8", "12", "18"], answer: 2, explanation: "The highest common factor of 24 and 36 is 12." },
          { q: "An article bought for ₹500 is sold at a loss of 10%. What is the selling price?", options: ["₹440", "₹450", "₹460", "₹470"], answer: 1, explanation: "Loss = 50, so SP = 500 − 50 = ₹450." },
          { q: "The simple interest on ₹2000 for 3 years is ₹360. What is the annual rate?", options: ["5%", "6%", "7%", "8%"], answer: 1, explanation: "Rate = 360 × 100 ÷ (2000 × 3) = 6%." },
          { q: "The average of 4 numbers is 25. When a fifth number is added, the average becomes 24. What is the fifth number?", options: ["18", "19", "20", "21"], answer: 2, explanation: "Old total 100, new total 120, so the fifth number is 20." },
          { q: "A bag has 4 red and 6 blue balls. What is the probability of drawing a red ball?", options: ["2/5", "3/5", "1/2", "4/3"], answer: 0, explanation: "4 out of 10 simplifies to 2/5." },
          { q: "If x ÷ 4 = 12, what is x?", options: ["3", "36", "48", "16"], answer: 2, explanation: "x = 12 × 4 = 48." },
        ],
      },

      "data-structures": {
        overview:
          "Data structures are the backbone of efficient programming because they decide how fast your code runs and how much memory it consumes. An array gives instant indexed access but costly insertions, while a linked list trades that speed for flexible growth. A stack follows Last-In-First-Out and powers recursion, undo and expression evaluation, whereas a queue follows First-In-First-Out for scheduling and breadth-first search. Trees and graphs model hierarchical and networked data, enabling fast search in binary search trees and path-finding with BFS or DFS. Hashing trades a little memory for near-constant-time lookups and is the default choice for frequency counting and de-duplication. Choosing the right structure for the problem is the single biggest lever on performance in coding interviews. Learn each structure's access, search, insert and delete costs before you memorise any algorithm.",
        flowchart: {
          title: "Choosing the Right Data Structure",
          steps: [
            { title: "Identify the Operation", detail: "What dominates the workload: lookups, inserts, deletes, or ordering?" },
            { title: "Check Ordering Needs", detail: "Is the data flat, sorted, hierarchical, or a network of relationships?" },
            { title: "Match the Access Pattern", detail: "Indexed access suits arrays; ends-only access suits stacks, queues and linked lists." },
            { title: "Consider Frequency", detail: "Counting or membership tests point to hash maps and sets." },
            { title: "Estimate Constraints", detail: "The input size decides whether an O(n log n) or O(n) target is required." },
            { title: "Analyse Complexity", detail: "Confirm the chosen structure meets the time and memory limit." },
          ],
        },
        facts: [
          "Array access is O(1), but searching is O(n)",
          "Stack = LIFO, Queue = FIFO",
          "Hash maps give O(1) average lookup",
          "Balanced BST search is O(log n)",
        ],
        mcqs: [
          { q: "Which data structure follows the Last-In-First-Out (LIFO) principle?", options: ["Queue", "Stack", "Linked List", "Heap"], answer: 1, explanation: "A stack removes the most recently added element first." },
          { q: "What is the time complexity of accessing an element by index in an array?", options: ["O(n)", "O(1)", "O(log n)", "O(n log n)"], answer: 1, explanation: "Array indexing is a direct memory offset, so it is constant time." },
          { q: "Which structure is best for implementing a breadth-first search (BFS)?", options: ["Stack", "Heap", "Queue", "Hash Map"], answer: 2, explanation: "BFS explores level by level, which a FIFO queue naturally provides." },
          { q: "In a balanced binary search tree, what is the average search time?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: 2, explanation: "Each comparison halves the remaining nodes, giving O(log n)." },
          { q: "Which data structure uses hashing for near-constant-time lookups?", options: ["Stack", "Queue", "Hash Map", "Linked List"], answer: 2, explanation: "A hash map maps keys to buckets for average O(1) access." },
          { q: "What is the worst-case time complexity of searching in a hash table?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: 1, explanation: "If every key collides into one bucket, search degrades to O(n)." },
          { q: "A min-heap guarantees that the smallest element is always at which position?", options: ["Any leaf", "The root", "The last node", "The middle"], answer: 1, explanation: "The heap property places the minimum at the root." },
          { q: "Which operation is expensive — O(n) — in a singly linked list?", options: ["Insert at head", "Delete at head", "Access the k-th element", "Push to front"], answer: 2, explanation: "There is no indexing, so you must walk the list to reach the k-th node." },
          { q: "In a graph, which traversal uses a stack or recursion to go deep first?", options: ["BFS", "DFS", "Dijkstra", "Topological sort"], answer: 1, explanation: "Depth-first search explores as far as possible before backtracking." },
          { q: "Which structure is most suitable for implementing an undo feature in an editor?", options: ["Queue", "Graph", "Stack", "Heap"], answer: 2, explanation: "Undo reverses the most recent action first, which is LIFO behaviour." },
        ],
        quizMcqs: [
          { q: "Which data structure follows the First-In-First-Out (FIFO) principle?", options: ["Stack", "Queue", "Tree", "Graph"], answer: 1, explanation: "A queue removes the earliest added element first." },
          { q: "What is the time complexity of inserting at the beginning of a linked list?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 0, explanation: "Only the head pointer changes, so it takes constant time." },
          { q: "Which tree traversal visits the root between the left and right subtrees?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], answer: 1, explanation: "In-order visits left, then root, then right." },
          { q: "Which structure manages function calls and recursion?", options: ["Queue", "Stack", "Heap", "Set"], answer: 1, explanation: "The call stack pushes and pops frames as functions are called." },
          { q: "A balanced binary tree with n nodes has a height of about:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 1, explanation: "Balanced trees halve the work at each level, giving logarithmic height." },
          { q: "Which sorting algorithm repeatedly selects the smallest remaining element?", options: ["Bubble sort", "Selection sort", "Merge sort", "Quick sort"], answer: 1, explanation: "Selection sort scans for the minimum and swaps it into place." },
          { q: "What is the worst-case time complexity of Quick Sort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], answer: 2, explanation: "Poor pivot choices create unbalanced partitions, degrading to O(n²)." },
          { q: "Which data structure is best for implementing a priority queue?", options: ["Array", "Linked List", "Heap", "Stack"], answer: 2, explanation: "A heap keeps the highest-priority element at the root in O(log n)." },
          { q: "In a hash table, what is a collision?", options: ["Two keys mapping to the same index", "A key not found", "A completely full table", "A deleted key"], answer: 0, explanation: "Different keys hashing to the same bucket cause a collision." },
          { q: "Which algorithm finds the shortest path in a weighted graph with non-negative edges?", options: ["DFS", "BFS", "Dijkstra", "Kruskal"], answer: 2, explanation: "Dijkstra relaxes edges greedily to find shortest paths." },
        ],
      },

      dbms: {
        overview:
          "A Database Management System stores, organises and secures data so that many users can work with it reliably at the same time. The relational model arranges data into tables, called relations, with rows and columns linked through keys: a primary key uniquely identifies a row and a foreign key references another table. Normalisation removes redundancy and update anomalies by splitting tables into well-formed relations up to 3NF or BCNF. SQL is the language used to define, query and control data, with joins combining tables and indexes accelerating lookups. Transactions follow the ACID properties — Atomicity, Consistency, Isolation and Durability — so partial failures never corrupt your data. Concurrency control lets many transactions run together without conflicting, and indexing balances fast reads against slower writes. Understanding these fundamentals is essential for both interviews and real systems.",
        flowchart: {
          title: "How a SQL Query Is Processed",
          steps: [
            { title: "Parse", detail: "Check the syntax and validate table and column names." },
            { title: "Optimise", detail: "Choose the best plan using indexes and table statistics." },
            { title: "Execute", detail: "Read rows and physically apply filters, joins and aggregations." },
            { title: "Return Result Set", detail: "Produce the final rows and hand them to the client." },
            { title: "Commit or Rollback", detail: "Persist the transaction or undo it cleanly on failure." },
          ],
        },
        facts: [
          "Primary key = unique and not null",
          "Normalisation removes redundancy",
          "Indexes speed up reads but slow writes",
          "ACID = Atomicity, Consistency, Isolation, Durability",
        ],
        mcqs: [
          { q: "Which normal form removes partial dependency on a composite primary key?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 1, explanation: "2NF eliminates partial dependencies on part of a composite key." },
          { q: "What does the 'A' in ACID stand for?", options: ["Availability", "Consistency", "Atomicity", "Durability"], answer: 2, explanation: "Atomicity means a transaction happens entirely or not at all." },
          { q: "Which SQL clause filters rows before grouping?", options: ["HAVING", "WHERE", "GROUP BY", "ORDER BY"], answer: 1, explanation: "WHERE filters rows before aggregation; HAVING filters after." },
          { q: "A column that uniquely identifies each row in a table is called a:", options: ["Foreign key", "Composite index", "Primary key", "Candidate key"], answer: 2, explanation: "A primary key uniquely and non-nullably identifies every row." },
          { q: "Which join returns only the rows that match in both tables?", options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"], answer: 2, explanation: "An INNER JOIN keeps only matching rows from both tables." },
          { q: "What is the primary purpose of an index in a database?", options: ["Remove duplicates", "Enforce normalisation", "Speed up data retrieval", "Store backups"], answer: 2, explanation: "Indexes let the engine locate rows without scanning the whole table." },
          { q: "Which normal form requires that there be no transitive dependency?", options: ["1NF", "2NF", "3NF", "4NF"], answer: 2, explanation: "3NF removes non-key attributes that depend on other non-key attributes." },
          { q: "Which SQL statement removes a table and its structure entirely?", options: ["DELETE", "TRUNCATE", "DROP", "REMOVE"], answer: 2, explanation: "DROP removes the table definition along with its data." },
          { q: "In ACID, which property guarantees committed data survives a crash?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], answer: 3, explanation: "Durability ensures committed changes persist even after a failure." },
          { q: "Aggregate functions in SQL are used to:", options: ["Sort rows", "Join tables", "Summarise rows into a single value", "Create indexes"], answer: 2, explanation: "Functions like COUNT, SUM and AVG condense many rows into one value." },
        ],
        quizMcqs: [
          { q: "Which normal form removes repeating groups and multi-valued attributes?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 0, explanation: "1NF requires atomic values in every column." },
          { q: "What does the 'I' in ACID stand for?", options: ["Integrity", "Isolation", "Indexing", "Iteration"], answer: 1, explanation: "Isolation keeps concurrent transactions from interfering with each other." },
          { q: "Which SQL keyword removes duplicate rows from a result set?", options: ["UNIQUE", "DISTINCT", "FILTER", "GROUP"], answer: 1, explanation: "SELECT DISTINCT returns only unique rows." },
          { q: "A key that references the primary key of another table is called a:", options: ["Super key", "Foreign key", "Candidate key", "Secondary key"], answer: 1, explanation: "A foreign key enforces referential integrity between tables." },
          { q: "Which SQL clause filters groups after aggregation?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], answer: 1, explanation: "HAVING applies conditions to aggregated groups." },
          { q: "What does a transaction's Atomicity ensure?", options: ["All or nothing execution", "Faster reads", "Unique rows", "Sorted output"], answer: 0, explanation: "Atomicity means the whole transaction succeeds or none of it does." },
          { q: "Which SQL sub-language is used to define database schema?", options: ["DML", "DDL", "DCL", "TCL"], answer: 1, explanation: "DDL statements such as CREATE and ALTER define structure." },
          { q: "Which join returns all rows from the left table plus matching rows from the right?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"], answer: 1, explanation: "A LEFT JOIN keeps every left row, filling nulls where there is no match." },
          { q: "Which index type is best suited for range queries?", options: ["Hash index", "B-tree index", "Bitmap index only", "No index"], answer: 1, explanation: "B-trees keep keys ordered, which supports range scans." },
          { q: "A deadlock in a DBMS occurs when:", options: ["Two transactions wait on each other's locks", "A query runs slowly", "An index is missing", "A table is dropped"], answer: 0, explanation: "Each transaction holds a lock the other needs, so neither can proceed." },
        ],
      },

      "hr-interview": {
        overview:
          "The HR interview decides whether the company wants to work with you, testing communication, attitude and cultural fit rather than technical depth. Most rounds revolve around a handful of predictable questions: tell me about yourself, strengths and weaknesses, why this company, and how you handled a challenge. The STAR method — Situation, Task, Action, Result — gives every story a clear, credible structure. Keep answers to roughly sixty to ninety seconds, stay specific, and always connect what you did back to the role you are applying for. Prepare three to five flexible stories you can adapt to different questions. Research the company's values and recent work, and prepare two thoughtful questions to ask the interviewer. Confidence, honesty and clarity matter far more than perfect wording.",
        flowchart: {
          title: "How to Structure an HR Answer (STAR)",
          steps: [
            { title: "Situation", detail: "Set the context briefly and specifically so the story is easy to follow." },
            { title: "Task", detail: "State your responsibility or the goal you were working towards." },
            { title: "Action", detail: "Explain exactly what you did and the decisions you made." },
            { title: "Result", detail: "Quantify the outcome and the lesson you carried forward." },
            { title: "Connect", detail: "Link the takeaway back to the role and the company's values." },
          ],
        },
        facts: [
          "Keep answers to 60–90 seconds",
          "Use STAR for behavioural questions",
          "Prepare 3–5 adaptable stories",
          "Always research the company first",
        ],
        mcqs: [
          { q: "Which method is recommended for answering behavioural HR questions?", options: ["SWOT", "STAR", "PDCA", "SMART"], answer: 1, explanation: "STAR — Situation, Task, Action, Result — gives answers a clear structure." },
          { q: "When asked 'Tell me about yourself', you should mainly focus on:", options: ["Your full life history", "A brief professional summary", "Salary expectations", "Your hobbies only"], answer: 1, explanation: "A concise professional summary relevant to the role works best." },
          { q: "What is the best way to describe a weakness?", options: ["Say you have none", "Mention a real one and how you are improving it", "Blame a colleague", "Change the subject"], answer: 1, explanation: "Honesty plus a concrete improvement plan shows self-awareness." },
          { q: "Why do interviewers ask 'Why should we hire you?'", options: ["To test your memory", "To see how you match the role's needs", "To check your degree", "To fill time"], answer: 1, explanation: "They want to hear how your skills solve their specific needs." },
          { q: "How long should a typical HR answer be?", options: ["10–15 seconds", "60–90 seconds", "5 minutes", "As long as possible"], answer: 1, explanation: "Around a minute to ninety seconds keeps the answer focused." },
          { q: "How should you prepare for 'Where do you see yourself in 5 years?'", options: ["Give a vague answer", "Refuse to answer", "Align your goals with the role and the company's growth", "Say you want the interviewer's job"], answer: 2, explanation: "Linking your goals to the company's direction reads as genuine commitment." },
          { q: "Researching the company before an HR interview helps you mainly to:", options: ["Negotiate salary only", "Tailor your answers to their values", "Avoid answering questions", "Impress with jargon"], answer: 1, explanation: "Knowing their values lets you frame answers that resonate." },
          { q: "What should you do if you do not know an answer?", options: ["Invent an answer", "Stay silent", "End the interview", "Stay honest and explain how you would find out"], answer: 3, explanation: "Honesty plus a sensible approach to finding the answer shows integrity." },
          { q: "At the end of an HR interview, you should:", options: ["Leave immediately", "Discuss salary first", "Ask thoughtful questions about the role", "Request feedback on the spot"], answer: 2, explanation: "Good questions show genuine interest in the role and team." },
          { q: "Which behaviour creates the best impression?", options: ["Arriving late", "Checking your phone", "Criticising past employers", "Clear, honest and concise answers"], answer: 3, explanation: "Clarity and honesty leave the strongest, most professional impression." },
        ],
        quizMcqs: [
          { q: "What does the 'R' in the STAR method stand for?", options: ["Reason", "Result", "Role", "Review"], answer: 1, explanation: "STAR ends with the Result you achieved." },
          { q: "Which question usually opens an HR interview?", options: ["A coding problem", "Tell me about yourself", "Design a database", "Explain normalisation"], answer: 1, explanation: "It is the standard warm-up question in HR rounds." },
          { q: "When discussing a failure, what should you emphasise?", options: ["Blaming others", "What you learned and improved", "Changing the topic", "That it was not your fault"], answer: 1, explanation: "Focusing on the lesson shows growth and self-awareness." },
          { q: "How should you handle a salary question early in the process?", options: ["Demand a fixed number", "Insist on knowing first", "Express flexibility and ask about the range", "Refuse to answer"], answer: 2, explanation: "Flexibility plus curiosity about the range keeps the discussion productive." },
          { q: "How should you explain a gap in your resume?", options: ["Hide it", "Explain it briefly and positively", "Lie about it", "Ignore the question"], answer: 1, explanation: "A short, honest and positive explanation builds trust." },
          { q: "When asked why you want to leave your current job, focus on:", options: ["Complaining about your manager", "Growth opportunities and positive reasons", "Salary alone", "Nothing at all"], answer: 1, explanation: "Forward-looking reasons come across far better than complaints." },
          { q: "What is the best body language during an HR interview?", options: ["Slouching", "Eye contact and an open posture", "Fidgeting", "Tightly crossed arms"], answer: 1, explanation: "Open posture and eye contact signal confidence and interest." },
          { q: "Which answer best demonstrates teamwork?", options: ["Using 'I' throughout", "Explaining how you supported and coordinated with others", "Criticising a teammate", "Taking all the credit"], answer: 1, explanation: "Showing collaboration and shared credit reflects real teamwork." },
          { q: "What is the ideal way to close an HR interview?", options: ["Walk out silently", "Thank the interviewer and reaffirm your interest", "Ask when you get paid", "Argue about the role"], answer: 1, explanation: "A courteous close that restates your interest leaves a strong impression." },
          { q: "Which quality do HR interviewers generally value most?", options: ["Aggression", "Honesty and clear communication", "Overconfidence", "Silence"], answer: 1, explanation: "Honest, clear communication is central to cultural fit." },
        ],
      },
    };

    return {
      modules: modules,
      moduleList: Object.keys(modules).map(function (k) { return modules[k]; }),
      moduleContent: moduleContent,
    };
  })();

  /* ------------------------------------------------------------ 3. auth -- */
  var SDK_URL = "https://esm.sh/@base44/sdk@0.8.54";
  var clientPromise = null;

  function authClient() {
    if (!clientPromise) {
      clientPromise = import(SDK_URL).then(function (sdk) {
        return sdk.createClient({
          appId: CONFIG.appId,
          appBaseUrl: CONFIG.appBaseUrl || window.location.origin,
          serverUrl: "",
          token: null,
        });
      });
    }
    return clientPromise;
  }

  function auth() {
    return authClient().then(function (c) { return c.auth; });
  }

  var authApi = {
    isConfigured: function () {
      return Boolean(CONFIG.appId) && CONFIG.appId.indexOf("YOUR_") !== 0;
    },
    login: function (email, password) {
      return auth().then(function (a) { return a.loginViaEmailPassword(email, password); });
    },
    register: function (email, password) {
      return auth().then(function (a) { return a.register({ email: email, password: password }); });
    },
    verifyOtp: function (email, otpCode) {
      return auth().then(function (a) { return a.verifyOtp({ email: email, otpCode: otpCode }); });
    },
    resendOtp: function (email) {
      return auth().then(function (a) { return a.resendOtp(email); });
    },
    resetPasswordRequest: function (email) {
      return auth().then(function (a) { return a.resetPasswordRequest(email); });
    },
    resetPassword: function (resetToken, newPassword) {
      return auth().then(function (a) { return a.resetPassword({ resetToken: resetToken, newPassword: newPassword }); });
    },
    setToken: function (token) {
      return auth().then(function (a) { return a.setToken(token); });
    }
  };

  /* --------------------------------------------- 4. theme + utilities ---- */
  var THEME_KEY = "cc-theme";
  var QUIZ_DURATION = 600; /* 10 minutes */

  var SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
  var MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(value) {
    return String(value).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function setTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem(THEME_KEY, dark ? "dark" : "light"); } catch (e) { /* ignore */ }
    var btn = $("#themeToggle");
    if (btn) {
      btn.innerHTML = dark ? SUN : MOON;
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  /* ------------------------------------------------- 5. header & footer -- */
  var NAV_ITEMS = [
    { route: "", label: "Home", key: "home" },
    { route: "aptitude", label: "Aptitude", key: "aptitude" },
    { route: "programming", label: "Programming", key: "programming" },
    { route: "core", label: "Core", key: "core" },
    { route: "hr", label: "HR", key: "hr" },
    { route: "about", label: "About", key: "about" }
  ];

  function buildChrome(key, authMode) {
    var header = $("#site-header");
    var footer = $("#site-footer");

    if (authMode) {
      /* Auth views stand alone: no navigation bar or footer around them. */
      if (header) header.innerHTML = "";
      if (footer) footer.innerHTML = "";
      return;
    }

    if (header) {
      header.innerHTML =
        '<header class="navbar"><div class="nav-inner">' +
        '<a class="brand" href="#/"><span class="brand-mark">CC</span><span class="brand-name">Code Craft</span></a>' +
        '<button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '<div class="nav-right">' +
        '<nav class="nav-links" id="navLinks">' +
        NAV_ITEMS.map(function (item) {
          return '<a class="nav-link' + (item.key === key ? " active" : "") + '" href="#/' + item.route + '">' + item.label + "</a>";
        }).join("") +
        "</nav>" +
        '<button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle dark mode"></button>' +
        '<a class="nav-cta" href="#/login">Log In</a>' +
        "</div></div></header>";
    }

    if (footer) {
      footer.innerHTML =
        '<footer class="footer"><div class="container">' +
        '<div class="footer-grid">' +
        '<div><a class="brand" href="#/"><span class="brand-mark">CC</span><span class="brand-name">Code Craft</span></a>' +
        "<p>Prepare Smarter. Get Placed Faster.<br>Your all-in-one platform for placement preparation.</p></div>" +
        '<div><h3>Preparation</h3><a class="f-link" href="#/aptitude">Aptitude</a><a class="f-link" href="#/programming">Programming</a><a class="f-link" href="#/core">DSA</a></div>' +
        '<div><h3>Career</h3><a class="f-link" href="#/hr">HR Interview</a><a class="f-link" href="#/core">Core Subjects</a><a class="f-link" href="#/about">About</a></div>' +
        '<div><h3>Company</h3><a class="f-link" href="#/about">About</a><a class="f-link" href="#/about">Contact</a></div>' +
        "</div>" +
        '<div class="footer-bottom"><span>© 2026 Code Craft. All Rights Reserved.</span>' +
        '<span><a href="#/about">Privacy</a><a href="#/about">Terms</a></span></div>' +
        "</div></footer>";
    }

    setTheme(document.documentElement.classList.contains("dark"));

    var toggle = $("#themeToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        setTheme(!document.documentElement.classList.contains("dark"));
      });
    }

    var menu = $("#menuToggle");
    var links = $("#navLinks");
    if (menu && links) {
      menu.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        menu.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  }

  /* ------------------------------------------------------------ scroll in */
  function initReveal() {
    var items = $$(".reveal");
    if (!items.length) return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "-60px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------- 6. partials */
  function moduleCard(m, index) {
    return '<article class="card module-card reveal" style="transition-delay:' + (index * 70) + 'ms">' +
      '<div class="card-icon">' + m.icon + "</div>" +
      "<h3>" + esc(m.title) + "</h3>" +
      '<p class="desc">' + esc(m.description) + "</p>" +
      '<a class="card-link" href="#/module/' + m.id + '">View Module <span>→</span></a>' +
      "</article>";
  }

  function topicItem(topic) {
    return '<div class="topic-item">' + esc(topic) + "</div>";
  }

  function flowChart(flowchart) {
    return flowchart.steps.map(function (step, i) {
      var edge = i === 0 || i === flowchart.steps.length - 1 ? " edge" : "";
      return '<div class="flow-step' + edge + '"><span class="flow-num">' + (i + 1) + "</span>" +
        "<p>" + esc(step.title) + "</p><small>" + esc(step.detail) + "</small></div>" +
        (i < flowchart.steps.length - 1 ? '<div class="flow-arrow">↓</div>' : "");
    }).join("");
  }

  function categoryRoute(category) {
    var c = String(category || "").toLowerCase();
    if (c === "aptitude") return "#/aptitude";
    if (c === "programming") return "#/programming";
    if (c === "core") return "#/core";
    if (c === "hr") return "#/hr";
    return "#/";
  }

  /* ----------------------------------------------------- 6a. home page -- */
  function renderHome() {
    var grid = $("#moduleGrid");
    if (grid) {
      grid.innerHTML = D.moduleList.map(moduleCard).join("");
    }
    var cats = $("#categoryGrid");
    if (cats) {
      var items = [
        { icon: "🧮", title: "Aptitude", href: "#/aptitude" },
        { icon: "💻", title: "Programming", href: "#/programming" },
        { icon: "🌳", title: "DSA", href: "#/programming" },
        { icon: "💼", title: "Core Subjects", href: "#/core" },
        { icon: "🎤", title: "HR Interview", href: "#/hr" }
      ];
      cats.innerHTML = items.map(function (c, i) {
        return '<a class="cat reveal" style="transition-delay:' + (i * 60) + 'ms" href="' + c.href + '">' +
          "<span>" + c.icon + "</span><div>" + c.title + "</div><small>Explore Now →</small></a>";
      }).join("");
    }
  }

  /* ---------------------------------------------------- 6b. track pages -- */
  var TRACKS = {
    aptitude: {
      moduleId: "quantitative-aptitude",
      badge: "🧮 Aptitude",
      title: "Quantitative Aptitude",
      intro: "Practice quantitative aptitude, logical reasoning, verbal reasoning and data interpretation to ace the first round of every placement test.",
      headTitle: "Topics Covered",
      headText: "Comprehensive topic coverage across the aptitude section."
    },
    programming: {
      moduleId: "data-structures",
      badge: "💻 Programming",
      title: "Programming & DSA",
      intro: "Practice programming problems and strengthen your data structures and algorithms fundamentals across topic-wise questions.",
      headTitle: "Data Structures Topics",
      headText: "Master important data structures through topic-wise questions."
    },
    core: {
      moduleId: "dbms",
      badge: "💼 Core Subjects",
      title: "Core CS Subjects",
      intro: "Prepare for technical interviews with core computer science subjects — DBMS, Operating Systems, Computer Networks and OOP concepts.",
      headTitle: "DBMS Topics",
      headText: "Master database management systems with topic-wise practice."
    }
  };

  function renderTrack(key) {
    var cfg = TRACKS[key];
    if (!cfg) return;
    var m = D.modules[cfg.moduleId];
    $("#trackBadge").textContent = cfg.badge;
    $("#trackTitle").textContent = cfg.title;
    $("#trackIntro").textContent = cfg.intro;
    $("#trackHeadTitle").textContent = cfg.headTitle;
    $("#trackHeadText").textContent = cfg.headText;
    $("#trackTopics").innerHTML = m.topics.map(topicItem).join("");
    $("#trackAside").innerHTML = "<h3>" + esc(m.title) + "</h3><p>" + esc(m.description) + "</p>" +
      '<a class="btn btn-primary wfull" href="#/module/' + m.id + '">View Module →</a>';
  }

  /* ---------------------------------------------------- 6c. about page -- */
  function renderAbout() {
    var grid = $("#aboutModules");
    if (!grid) return;
    grid.innerHTML = D.moduleList.map(function (m) {
      return '<a class="link-tile" href="#/module/' + m.id + '"><span>' + m.icon + "</span>" +
        "<h3>" + esc(m.title) + "</h3><small>View Module →</small></a>";
    }).join("");
  }

  /* --------------------------------------------------- 6d. module page -- */
  function renderModule(id) {
    var m = D.modules[id];
    $("#moduleMain").hidden = !m;
    $("#moduleMissing").hidden = Boolean(m);
    if (!m) return;

    var content = D.moduleContent[id];
    var category = categoryRoute(m.category);

    $("#moduleCrumb").setAttribute("href", category);
    $("#moduleBack").setAttribute("href", category);
    $("#moduleIcon").textContent = m.icon;
    $("#moduleCategory").textContent = m.category;
    $("#moduleTitle").textContent = m.title;
    $("#moduleDescription").textContent = m.description;
    $("#moduleTopics").innerHTML = m.topics.map(topicItem).join("");

    if (content) {
      $("#guideOverview").textContent = content.overview;
      $("#guideFacts").innerHTML = content.facts.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
      $("#guideFlowTitle").textContent = content.flowchart.title;
      $("#guideFlow").innerHTML = flowChart(content.flowchart);

      $$("#moduleActions [data-action]").forEach(function (btn) {
        btn.onclick = function (event) {
          event.preventDefault();
          var action = btn.getAttribute("data-action");
          if (action === "practice") openPractice(content.mcqs);
          else if (action === "quiz") openQuiz(content.quizMcqs);
          else document.getElementById("guide").scrollIntoView({ behavior: "smooth", block: "start" });
        };
      });
    }
  }

  /* --------------------------------------- 7. practice & quiz (panels) -- */
  var quizTimer = null;

  function stopQuizTimer() {
    if (quizTimer) { clearInterval(quizTimer); quizTimer = null; }
  }

  function closePanels() {
    stopQuizTimer();
    var mount = $("#actionPanel");
    if (mount) { mount.hidden = true; mount.innerHTML = ""; mount.onclick = null; }
  }

  function optionClass(index, question, state) {
    if (!state.answered) return "option";
    if (index === question.answer) return "option correct";
    if (index === state.selected) return "option wrong";
    return "option dim";
  }

  function practiceMarkup(state, mcqs) {
    var q = mcqs[state.idx];
    var head = '<div class="panel-head"><div class="panel-title"><span class="ico">✎</span>' +
      "<div><h3>Practice Mode</h3><p>Instant feedback after every answer</p></div></div>" +
      '<button class="icon-btn" type="button" data-close aria-label="Close practice">✕</button></div>';

    if (state.done) {
      var pct = Math.round((state.score / mcqs.length) * 100);
      return '<div class="panel">' + head + '<div class="center">' +
        '<p class="muted">Practice complete</p>' +
        '<p class="big-score">' + state.score + "<span>/" + mcqs.length + "</span></p>" +
        '<p class="muted">You scored ' + pct + "% correct.</p>" +
        '<div class="panel-actions end"><button class="btn btn-primary" type="button" data-restart>Practice Again</button>' +
        '<button class="btn btn-plain" type="button" data-close>Close</button></div></div></div>';
    }

    var answered = state.answered;
    var feedback = answered
      ? '<div class="feedback ' + (state.selected === q.answer ? "ok" : "bad") + '">' +
        "<span>" + (state.selected === q.answer ? "✓" : "✕") + "</span><span><b>" +
        (state.selected === q.answer ? "Correct!" : "Not quite.") + "</b> " + esc(q.explanation) + "</span></div>"
      : "";

    return '<div class="panel">' + head +
      '<div class="q-meta"><span>Question ' + (state.idx + 1) + " of " + mcqs.length + "</span>" +
      '<span>Score: <b>' + state.score + "</b></span></div>" +
      '<div class="q-bar"><i style="width:' + (((state.idx + (answered ? 1 : 0)) / mcqs.length) * 100) + '%"></i></div>' +
      '<p class="q-text">' + esc(q.q) + "</p>" +
      '<div class="options">' + q.options.map(function (opt, i) {
        return '<button class="' + optionClass(i, q, state) + '" type="button" data-opt="' + i + '">' + esc(opt) + "</button>";
      }).join("") + "</div>" + feedback +
      '<div class="panel-actions"><button class="btn btn-primary" type="button" data-next' + (answered ? "" : " disabled") + ">" +
      (state.idx + 1 >= mcqs.length ? "See Results" : "Next Question") + " →</button></div></div>";
  }

  function openPractice(mcqs) {
    if (!mcqs || !mcqs.length) return;
    var mount = $("#actionPanel");
    var state = { idx: 0, selected: null, answered: false, score: 0, done: false };

    function draw() { mount.innerHTML = practiceMarkup(state, mcqs); }

    mount.onclick = function (event) {
      var target = event.target;
      if (target.closest("[data-close]")) { closePanels(); return; }
      if (target.closest("[data-restart]")) {
        state = { idx: 0, selected: null, answered: false, score: 0, done: false };
        draw();
        return;
      }
      var opt = target.closest("[data-opt]");
      if (opt && !state.answered) {
        state.selected = Number(opt.getAttribute("data-opt"));
        state.answered = true;
        if (state.selected === mcqs[state.idx].answer) state.score += 1;
        draw();
        return;
      }
      if (target.closest("[data-next]") && state.answered) {
        if (state.idx + 1 >= mcqs.length) state.done = true;
        else { state.idx += 1; state.selected = null; state.answered = false; }
        draw();
      }
    };

    mount.hidden = false;
    draw();
    mount.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function formatTime(seconds) {
    var m = String(Math.floor(seconds / 60)).padStart(2, "0");
    var s = String(seconds % 60).padStart(2, "0");
    return m + ":" + s;
  }

  function quizMarkup(state, mcqs) {
    var head = '<div class="panel-head"><div class="panel-title violet"><span class="ico">?</span>' +
      "<div><h3>Timed Quiz</h3><p>" + mcqs.length + " questions · " + QUIZ_DURATION / 60 + " minutes</p></div></div>" +
      '<button class="icon-btn" type="button" data-close aria-label="Close quiz">✕</button></div>';

    if (!state.started) {
      return '<div class="panel">' + head + '<div class="center">' +
        '<p class="muted">Answer all ' + mcqs.length + " questions before the timer runs out. Your score updates as you answer correctly, and the full results appear at the end.</p>" +
        '<button class="btn btn-violet" type="button" data-start style="margin-top:24px">Start Quiz →</button></div></div>';
    }

    if (state.finished) {
      var score = state.answers.reduce(function (acc, answer, i) {
        return acc + (answer !== null && answer === mcqs[i].answer ? 1 : 0);
      }, 0);
      var pct = Math.round((score / mcqs.length) * 100);
      var review = mcqs.map(function (item, i) {
        var chosen = state.answers[i];
        var right = chosen === item.answer;
        return '<div class="review-item"><p class="q">' + (right ? "✓" : "✕") + " " + (i + 1) + ". " + esc(item.q) + "</p>" +
          '<p class="a">Your answer: <b class="' + (right ? "ok" : "bad") + '">' +
          (chosen === null ? "Not answered" : esc(item.options[chosen])) + "</b></p>" +
          (right ? "" : '<p class="a">Correct answer: <b class="ok">' + esc(item.options[item.answer]) + "</b></p>") +
          '<p class="a">' + esc(item.explanation) + "</p></div>";
      }).join("");

      return '<div class="panel">' + head + '<div class="center">' +
        '<p style="font-size:28px">🏆</p><p class="muted">Quiz complete</p>' +
        '<p class="big-score violet">' + score + "<span>/" + mcqs.length + "</span></p>" +
        '<p class="muted">You scored ' + pct + "%.</p>" +
        '<div class="panel-actions end"><button class="btn btn-violet" type="button" data-restart>Retake Quiz</button>' +
        '<button class="btn btn-plain" type="button" data-close>Close</button></div></div>' +
        '<div class="review">' + review + "</div></div>";
    }

    var q = mcqs[state.idx];
    var committed = state.answers.reduce(function (acc, answer, i) {
      return acc + (answer !== null && answer === mcqs[i].answer ? 1 : 0);
    }, 0);
    var liveScore = committed + (state.selected !== null && state.selected === q.answer ? 1 : 0);

    return '<div class="panel">' + head +
      '<div class="timer-bar"><span class="clock">⏱ <span data-timer>' + formatTime(state.timeLeft) + "</span></span>" +
      '<span class="score">Score: <b>' + liveScore + "</b></span></div>" +
      '<div class="q-meta violet"><span>Question ' + (state.idx + 1) + " of " + mcqs.length + "</span></div>" +
      '<div class="q-bar"><i class="violet" style="width:' + ((state.idx / mcqs.length) * 100) + '%"></i></div>' +
      '<p class="q-text">' + esc(q.q) + "</p>" +
      '<div class="options">' + q.options.map(function (opt, i) {
        return '<button class="option violet-hover' + (state.selected === i ? " picked" : "") + '" type="button" data-pick="' + i + '">' + esc(opt) + "</button>";
      }).join("") + "</div>" +
      '<div class="panel-actions"><button class="btn btn-violet" type="button" data-next' + (state.selected === null ? " disabled" : "") + ">" +
      (state.idx + 1 >= mcqs.length ? "Submit Quiz" : "Next Question") + " →</button></div></div>";
  }

  function openQuiz(mcqs) {
    if (!mcqs || !mcqs.length) return;
    var mount = $("#actionPanel");
    var state = { started: false, finished: false, idx: 0, selected: null, timeLeft: QUIZ_DURATION, answers: mcqs.map(function () { return null; }) };

    function draw() { mount.innerHTML = quizMarkup(state, mcqs); }

    function tick() {
      state.timeLeft -= 1;
      var box = mount.querySelector("[data-timer]");
      if (box) box.textContent = formatTime(Math.max(state.timeLeft, 0));
      if (state.timeLeft <= 0) {
        if (state.selected !== null) state.answers[state.idx] = state.selected;
        state.finished = true;
        stopQuizTimer();
        draw();
      }
    }

    mount.onclick = function (event) {
      var target = event.target;
      if (target.closest("[data-close]")) { closePanels(); return; }
      if (target.closest("[data-start]")) {
        state.started = true;
        draw();
        stopQuizTimer();
        quizTimer = setInterval(tick, 1000);
        return;
      }
      if (target.closest("[data-restart]")) {
        state = { started: false, finished: false, idx: 0, selected: null, timeLeft: QUIZ_DURATION, answers: mcqs.map(function () { return null; }) };
        stopQuizTimer();
        draw();
        return;
      }
      var pick = target.closest("[data-pick]");
      if (pick) {
        state.selected = Number(pick.getAttribute("data-pick"));
        draw();
        return;
      }
      if (target.closest("[data-next]") && state.selected !== null) {
        state.answers[state.idx] = state.selected;
        if (state.idx + 1 >= mcqs.length) {
          state.finished = true;
          stopQuizTimer();
        } else {
          state.idx += 1;
          state.selected = null;
        }
        draw();
      }
    };

    mount.hidden = false;
    draw();
    mount.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* -------------------------------------------------------- 8. auth views */
  var registerEmail = "";
  var resetToken = "";

  function showError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
  }

  function wireAuthViews() {
    var configured = authApi.isConfigured();
    if (!configured) {
      ["#loginNote", "#registerNote", "#forgotNote"].forEach(function (sel) {
        var note = $(sel);
        if (note) note.hidden = false;
      });
    }

    /* login */
    var loginForm = $("#loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var error = $("#loginError");
        var btn = $("#loginSubmit");
        error.hidden = true;
        btn.disabled = true;
        btn.textContent = "Logging in...";
        authApi.login($("#loginEmail").value.trim(), $("#loginPassword").value)
          .then(function () { window.location.hash = "#/"; })
          .catch(function (err) {
            showError(error, (err && err.message) || "Invalid email or password. Please try again.");
            btn.disabled = false;
            btn.textContent = "Log in";
          });
      });
    }

    /* register */
    var registerForm = $("#registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var error = $("#registerError");
        var btn = $("#registerSubmit");
        var password = $("#registerPassword").value;
        registerEmail = $("#registerEmail").value.trim();
        error.hidden = true;

        if (password !== $("#registerConfirm").value) {
          showError(error, "Passwords do not match");
          return;
        }

        btn.disabled = true;
        btn.textContent = "Creating account...";
        authApi.register(registerEmail, password)
          .then(function () {
            $("#otpSubtitle").textContent = "We sent a verification code to " + registerEmail;
            $("#registerStepForm").hidden = true;
            $("#registerStepOtp").hidden = false;
            $("#otpInput").focus();
          })
          .catch(function (err) {
            showError(error, (err && err.message) || "Could not create account. Please try again.");
          })
          .then(function () {
            btn.disabled = false;
            btn.textContent = "Create account";
          });
      });
    }

    var otpForm = $("#otpForm");
    if (otpForm) {
      otpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var error = $("#otpError");
        var btn = $("#verifyBtn");
        error.hidden = true;
        btn.disabled = true;
        btn.textContent = "Verifying...";
        authApi.verifyOtp(registerEmail, $("#otpInput").value)
          .then(function (result) {
            var token = result && (result.access_token || result.accessToken || result.token);
            if (token) return authApi.setToken(token);
          })
          .then(function () { window.location.hash = "#/"; })
          .catch(function (err) {
            showError(error, (err && err.message) || "Invalid or expired code. Please try again.");
            btn.disabled = false;
            btn.textContent = "Verify & continue";
          });
      });

      $("#resendBtn").addEventListener("click", function () {
        var error = $("#otpError");
        error.hidden = true;
        authApi.resendOtp(registerEmail).catch(function (err) {
          showError(error, (err && err.message) || "Could not resend code.");
        });
      });

      $("#backBtn").addEventListener("click", function () {
        $("#registerStepOtp").hidden = true;
        $("#registerStepForm").hidden = false;
      });
    }

    /* forgot password */
    var forgotForm = $("#forgotForm");
    if (forgotForm) {
      forgotForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var btn = $("#forgotSubmit");
        btn.disabled = true;
        btn.textContent = "Sending...";
        authApi.resetPasswordRequest($("#forgotEmail").value.trim())
          .catch(function () { /* the generic success message is shown either way */ })
          .then(function () {
            forgotForm.hidden = true;
            $("#forgotSent").hidden = false;
          });
      });
    }

    /* new password */
    var resetForm = $("#resetForm");
    if (resetForm) {
      resetForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var error = $("#resetError");
        var btn = $("#resetSubmit");
        var password = $("#resetPassword").value;
        error.hidden = true;

        if (password !== $("#resetConfirm").value) {
          showError(error, "Passwords do not match");
          return;
        }

        btn.disabled = true;
        btn.textContent = "Resetting...";
        authApi.resetPassword(resetToken, password)
          .then(function () { window.location.hash = "#/login"; })
          .catch(function (err) {
            showError(error, (err && err.message) || "Failed to reset password");
            btn.disabled = false;
            btn.textContent = "Reset password";
          });
      });
    }
  }

  function showResetView(token) {
    var block = $("#resetFormBlock");
    var invalid = $("#resetInvalid");
    resetToken = token || "";
    if (!resetToken) {
      block.hidden = true;
      invalid.hidden = false;
      return;
    }
    block.hidden = false;
    invalid.hidden = true;
  }

  /* ---------------------------------------------------------- 9. router -- */
  var AUTH_VIEWS = {
    "login": { view: "#view-login", title: "Log in" },
    "register": { view: "#view-register", title: "Create account" },
    "forgot-password": { view: "#view-forgot", title: "Reset password" },
    "reset-password": { view: "#view-reset", title: "New password" }
  };

  function parseHash() {
    var raw = window.location.hash.replace(/^#\/?/, "");
    var qi = raw.indexOf("?");
    var query = new URLSearchParams(qi >= 0 ? raw.slice(qi) : "");
    var path = qi >= 0 ? raw.slice(0, qi) : raw;
    var parts = path.split("/").filter(Boolean);
    return { name: parts[0] || "", param: parts[1] || "", query: query };
  }

  function showView(selector) {
    $$("main .view").forEach(function (el) {
      el.hidden = "#" + el.id !== selector;
    });
  }

  function activate() {
    var r = parseHash();
    var view = "#view-home";
    var title = "Code Craft — Placement Preparation Portal";
    var navKey = "home";
    var authMode = false;

    closePanels();

    if (TRACKS[r.name]) {
      view = "#view-track";
      title = TRACKS[r.name].title + " — Code Craft";
      navKey = r.name;
      renderTrack(r.name);
    } else if (r.name === "hr") {
      view = "#view-hr";
      title = "HR Interview — Code Craft";
      navKey = "hr";
    } else if (r.name === "about") {
      view = "#view-about";
      title = "About — Code Craft";
      navKey = "about";
      renderAbout();
    } else if (r.name === "module") {
      view = "#view-module";
      var m = D.modules[r.param];
      title = (m ? m.title : "Module not found") + " — Code Craft";
      navKey = m ? String(m.category).toLowerCase() : "home";
      renderModule(r.param);
    } else if (AUTH_VIEWS[r.name]) {
      view = AUTH_VIEWS[r.name].view;
      title = AUTH_VIEWS[r.name].title + " — Code Craft";
      authMode = true;
      if (r.name === "reset-password") showResetView(r.query.get("token"));
    } else {
      renderHome();
    }

    showView(view);
    document.title = title;
    document.body.classList.toggle("auth-mode", authMode);
    buildChrome(navKey, authMode);
    initReveal();
    window.scrollTo(0, 0);
  }

  wireAuthViews();
  window.addEventListener("hashchange", activate);
  activate();
})();
function goTo(pageId) {
  if (!document.getElementById(pageId)) return;

  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.nav === pageId);
  });

  navLinksWrap.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delegate clicks for anything with a data-nav attribute (links, buttons, cards)
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-nav]');
  if (!target) return;
  e.preventDefault();
  goTo(target.dataset.nav);
});

/* ---------- Mobile menu ---------- */
menuToggle.addEventListener('click', () => {
  navLinksWrap.classList.toggle('open');
});

/* ---------- Toast ---------- */
function showToast(message) {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  requestAnimationFrame(() => {
    toastEl.style.opacity = '1';
  });
  toastTimer = setTimeout(() => {
    toastEl.style.opacity = '0';
    setTimeout(() => toastEl.classList.add('hidden'), 250);
  }, 2200);
}

/* ---------- Demo action buttons (Start Practice / Take Quiz) ---------- */
function demoAction(label) {
  showToast(`${label}: this feature is coming in the next phase.`);
}
window.demoAction = demoAction; // used by inline onclick handlers in the HTML

/* ---------- Login form (demo only — no backend) ---------- */
const loginForm = document.getElementById('loginForm');
const loginResult = document.getElementById('loginResult');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();

  loginResult.textContent = `Welcome, ${email}! (Demo login — authentication isn't wired up yet in this MVP.)`;
  loginResult.classList.remove('hidden');
  loginResult.classList.add('success');

  loginForm.reset();
  showToast('Logged in (demo)');
});

/* ---------- Register form (demo only — no backend) ---------- */
const registerForm = document.getElementById('registerForm');
const registerResult = document.getElementById('registerResult');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('regName').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;

  if (password !== confirm) {
    registerResult.textContent = 'Passwords do not match. Please try again.';
    registerResult.classList.remove('hidden');
    registerResult.classList.remove('success');
    return;
  }

  registerResult.textContent = `Account created for ${name}! (Demo signup — authentication isn't wired up yet in this MVP.)`;
  registerResult.classList.remove('hidden');
  registerResult.classList.add('success');

  registerForm.reset();
  showToast('Account created (demo)');

  setTimeout(() => goTo('login'), 1200);
});

/* ---------- Init ---------- */
goTo('home');
