// Complete roadmap generator - ALL tasks with full details
const fs = require('fs');
const path = require('path');

function createTask(id, title, description, phase, month, week, priority, hours, tags = [], deps = []) {
  return {
    id,
    title,
    description: description || title,
    status: 'pending',
    priority,
    phaseId: `phase-${phase}`,
    monthId: month !== undefined ? `month-${month}` : undefined,
    weekId: week !== undefined ? `week-${month}-${week}` : undefined,
    estimatedHours: hours,
    actualHours: 0,
    tags,
    dependencies: deps,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const allTasks = [];

// ========== PHASE 0: ABSOLUTE BASICS (Week 0) ==========
allTasks.push(createTask('task-0-1', 'Computer Setup - Prepare development machine',
  'Get a computer with at least 16GB RAM (32GB recommended), Install Ubuntu 22.04 LTS (dual boot or main OS), Learn basic Linux commands, Install VSCode or your preferred IDE, Set up GitHub account, Learn basic Git commands',
  0, 0, 1, 'high', 8, ['setup', 'linux', 'git', 'tools']));

allTasks.push(createTask('task-0-1-1', 'Learning: Linux Command Line Basics',
  'Complete "Linux Command Line Basics" - Free YouTube course, Practice on: https://www.learnenough.com/command-line-tutorial',
  0, 0, 1, 'high', 4, ['linux', 'learning', 'tutorial'], ['task-0-1']));

allTasks.push(createTask('task-0-1-2', 'Learning: Git Tutorial for Beginners',
  'Complete "Git Tutorial for Beginners" - Free on YouTube, Practice basic Git commands',
  0, 0, 1, 'high', 2, ['git', 'learning', 'tutorial'], ['task-0-1']));

allTasks.push(createTask('task-0-1-3', 'Project: Complete Linux command line tutorial',
  'Practice navigating directories, creating files, using basic commands (ls, cd, mkdir, rm, cp, mv, grep, find). Checkpoint: Can you navigate directories, create files, and push to GitHub?',
  0, 0, 1, 'high', 4, ['linux', 'practice', 'project'], ['task-0-1-1']));

allTasks.push(createTask('task-0-1-4', 'Project: Set up and push first repository to GitHub',
  'Create GitHub account, initialize local repo, make commits, push to remote, create README',
  0, 0, 1, 'high', 2, ['git', 'github', 'practice', 'project'], ['task-0-1-2']));

allTasks.push(createTask('task-0-2', 'Programming Fundamentals - Learn basic programming concepts',
  'Learn Variables, data types, operators, Control flow (if/else, loops), Functions and methods, Basic data structures (arrays, dictionaries), Object-oriented programming basics, Error handling. Start with Python 3.11+',
  0, 0, 1, 'critical', 80, ['programming', 'python', 'fundamentals']));

allTasks.push(createTask('task-0-2-1', 'Learning: Python for Beginners course',
  'Complete "Python for Beginners" course, Install Python 3.11+, Use Codecademy: Learn Python 3 (free tier) or "Automate the Boring Stuff with Python" book',
  0, 0, 1, 'critical', 40, ['python', 'learning', 'course'], ['task-0-2']));

allTasks.push(createTask('task-0-2-2', 'Practice: CodeWars exercises',
  'Practice on: https://www.codewars.com (start with 8 kyu), Complete at least 20 beginner exercises',
  0, 0, 1, 'medium', 10, ['python', 'practice', 'codewars'], ['task-0-2-1']));

allTasks.push(createTask('task-0-2-3', 'Project: Build Calculator',
  'Create a calculator that can perform basic arithmetic operations (add, subtract, multiply, divide)',
  0, 0, 1, 'medium', 2, ['python', 'project', 'beginner'], ['task-0-2-1']));

allTasks.push(createTask('task-0-2-4', 'Project: Build To-Do List',
  'Create a command-line to-do list application with add, remove, list, and mark complete features',
  0, 0, 1, 'medium', 3, ['python', 'project', 'beginner'], ['task-0-2-1']));

allTasks.push(createTask('task-0-2-5', 'Project: Build File Organizer',
  'Create a script that organizes files in a directory by extension into subdirectories',
  0, 0, 1, 'medium', 3, ['python', 'project', 'beginner'], ['task-0-2-1']));

allTasks.push(createTask('task-0-2-6', 'Project: Build Simple Web Scraper',
  'Create a web scraper that extracts specific information from a website using requests and BeautifulSoup',
  0, 0, 1, 'medium', 4, ['python', 'project', 'beginner', 'web'], ['task-0-2-1']));

allTasks.push(createTask('task-0-2-7', 'Project: Build Password Generator',
  'Create a password generator with customizable length and character sets',
  0, 0, 1, 'medium', 2, ['python', 'project', 'beginner', 'security'], ['task-0-2-1']));

allTasks.push(createTask('task-0-2-8', 'Checkpoint: Programming Fundamentals',
  'Verify: Built all 5 projects and understand basic Python? Can explain OOP concepts? Can handle errors properly?',
  0, 0, 1, 'high', 0, ['checkpoint', 'review'], ['task-0-2-3', 'task-0-2-4', 'task-0-2-5', 'task-0-2-6', 'task-0-2-7']));

allTasks.push(createTask('task-0-3', 'Networking Basics - Understand how computers communicate',
  'Learn OSI Model (7 layers), TCP/IP Protocol suite, IP addresses (IPv4/IPv6), Ports and services, DNS basics, HTTP/HTTPS protocols, Common network tools (ping, traceroute, nslookup)',
  0, 0, 1, 'high', 40, ['networking', 'fundamentals']));

allTasks.push(createTask('task-0-3-1', 'Learning: Network Fundamentals',
  'Watch Professor Messer\'s Network+ videos (free on YouTube), Read "Computer Networking: A Top-Down Approach" book chapters 1-3, Practice on: TryHackMe "Network Fundamentals" path',
  0, 0, 1, 'high', 20, ['networking', 'learning', 'course'], ['task-0-3']));

allTasks.push(createTask('task-0-3-2', 'Project: Set up 2 VMs and make them communicate',
  'Set up two virtual machines, configure networking, test connectivity, capture traffic with Wireshark, understand what you see',
  0, 0, 1, 'high', 6, ['networking', 'project', 'hands-on'], ['task-0-3-1']));

allTasks.push(createTask('task-0-3-3', 'Checkpoint: Networking Basics',
  'Verify: Can you explain how a web page loads from typing URL to seeing content? Understand OSI model? Can use network tools?',
  0, 0, 1, 'high', 0, ['checkpoint', 'review'], ['task-0-3-2']));

// ========== PHASE 1: SECURITY FUNDAMENTALS (Months 1-2) ==========
// Month 1, Week 1
allTasks.push(createTask('task-1-1', 'Security Concepts Foundation - Learn core security principles',
  'Learn CIA Triad (Confidentiality, Integrity, Availability), Authentication vs Authorization, Encryption basics (symmetric, asymmetric), Hashing vs Encryption, Digital signatures, SSL/TLS handshake, Common attack types overview',
  1, 1, 1, 'critical', 80, ['security', 'fundamentals', 'cryptography']));

allTasks.push(createTask('task-1-1-1', 'Day 1-2: CIA Triad and basic principles',
  'Study CIA Triad in depth, Learn security principles, Understand confidentiality, integrity, availability concepts',
  1, 1, 1, 'high', 16, ['security', 'fundamentals', 'cia-triad'], ['task-1-1']));

allTasks.push(createTask('task-1-1-2', 'Day 3-4: Cryptography fundamentals',
  'Learn symmetric encryption, asymmetric encryption, hashing algorithms, digital signatures, key management',
  1, 1, 1, 'high', 16, ['security', 'cryptography', 'encryption'], ['task-1-1-1']));

allTasks.push(createTask('task-1-1-3', 'Day 5-6: Authentication mechanisms',
  'Study authentication methods, password security, multi-factor authentication, session management',
  1, 1, 1, 'high', 16, ['security', 'authentication'], ['task-1-1-2']));

allTasks.push(createTask('task-1-1-4', 'Day 7-8: Common vulnerabilities overview',
  'Study OWASP Top 10, Common attack vectors, Vulnerability types, Impact assessment',
  1, 1, 1, 'high', 16, ['security', 'vulnerabilities', 'owasp'], ['task-1-1-3']));

allTasks.push(createTask('task-1-1-5', 'Day 9-10: Security frameworks',
  'Learn NIST framework basics, ISO 27001 basics, Security control frameworks',
  1, 1, 1, 'medium', 16, ['security', 'frameworks', 'nist'], ['task-1-1-4']));

allTasks.push(createTask('task-1-1-6', 'Day 11-14: Practice labs and review',
  'Complete practice labs, Review all concepts, Take practice quizzes, Prepare for next phase',
  1, 1, 1, 'high', 16, ['security', 'practice', 'review'], ['task-1-1-5']));

allTasks.push(createTask('task-1-1-7', 'Learning: CompTIA Security+',
  'Watch Professor Messer free videos for CompTIA Security+, Study security concepts',
  1, 1, 1, 'high', 20, ['security', 'learning', 'certification'], ['task-1-1']));

allTasks.push(createTask('task-1-1-8', 'Learning: Cybrary Introduction to IT & Cybersecurity',
  'Complete Cybrary: Introduction to IT & Cybersecurity course',
  1, 1, 1, 'high', 10, ['security', 'learning', 'cybrary'], ['task-1-1']));

allTasks.push(createTask('task-1-1-9', 'Learning: OWASP Top 10 documentation',
  'Read OWASP Top 10 documentation thoroughly, Understand each vulnerability type',
  1, 1, 1, 'critical', 8, ['security', 'learning', 'owasp'], ['task-1-1']));

allTasks.push(createTask('task-1-1-10', 'Project: Set up home lab with VirtualBox',
  'Install VirtualBox, create Kali Linux VM, install vulnerable VM (Metasploitable, DVWA), practice basic network scanning',
  1, 1, 1, 'high', 8, ['security', 'project', 'lab'], ['task-1-1']));

allTasks.push(createTask('task-1-1-11', 'Checkpoint: Security Concepts Foundation',
  'Verify: Can you explain common attacks and basic defense mechanisms? Understand CIA Triad? Know encryption basics?',
  1, 1, 1, 'high', 0, ['checkpoint', 'review'], ['task-1-1-6']));

// Month 1, Week 2 - SQL Injection
allTasks.push(createTask('task-1-2', 'Web Application Security - Week 1: SQL Injection',
  'Learn how databases work, SQL basics (SELECT, INSERT, UPDATE, DELETE), SQL injection techniques, Prevention methods. Practice on DVWA',
  1, 1, 2, 'critical', 40, ['security', 'web', 'sql-injection']));

allTasks.push(createTask('task-1-2-1', 'Learning: How databases work',
  'Study database fundamentals, SQL queries, Database structure, Relational databases',
  1, 1, 2, 'high', 8, ['database', 'sql', 'learning'], ['task-1-2']));

allTasks.push(createTask('task-1-2-2', 'Learning: SQL basics',
  'Master SELECT, INSERT, UPDATE, DELETE statements, WHERE clauses, JOINs, Subqueries',
  1, 1, 2, 'high', 8, ['sql', 'learning'], ['task-1-2-1']));

allTasks.push(createTask('task-1-2-3', 'Learning: SQL injection techniques',
  'Study union-based injection, error-based injection, blind SQL injection, time-based injection, second-order injection',
  1, 1, 2, 'critical', 12, ['security', 'sql-injection', 'learning'], ['task-1-2-2']));

allTasks.push(createTask('task-1-2-4', 'Learning: SQL injection prevention',
  'Learn parameterized queries, input validation, least privilege, WAF rules, secure coding practices',
  1, 1, 2, 'high', 8, ['security', 'prevention', 'learning'], ['task-1-2-3']));

allTasks.push(createTask('task-1-2-5', 'Project: Complete DVWA all levels for SQL injection',
  'Practice SQL injection on DVWA (Damn Vulnerable Web Application) across all difficulty levels: Low, Medium, High, Impossible',
  1, 1, 2, 'high', 12, ['security', 'project', 'web', 'sql-injection'], ['task-1-2-3']));

allTasks.push(createTask('task-1-2-6', 'Practice: TryHackMe SQL Injection room',
  'Complete TryHackMe SQL Injection room, Practice different injection techniques',
  1, 1, 2, 'high', 4, ['security', 'practice', 'tryhackme'], ['task-1-2-3']));

// Month 1, Week 3 - XSS and CSRF
allTasks.push(createTask('task-1-2-7', 'Web Application Security - Week 2: XSS and CSRF',
  'Learn JavaScript basics (DOM manipulation), Reflected vs Stored vs DOM XSS, CSRF attack mechanics, Prevention (CSP, tokens). Practice on XSS game',
  1, 1, 3, 'critical', 40, ['security', 'web', 'xss', 'csrf'], ['task-1-2']));

allTasks.push(createTask('task-1-2-8', 'Learning: JavaScript basics for security',
  'Study DOM manipulation, Event handlers, JavaScript execution context, Browser security model',
  1, 1, 3, 'high', 8, ['javascript', 'web', 'learning'], ['task-1-2-7']));

allTasks.push(createTask('task-1-2-9', 'Learning: XSS types',
  'Study Reflected XSS, Stored XSS, DOM-based XSS, Mutation XSS, Blind XSS',
  1, 1, 3, 'critical', 12, ['security', 'xss', 'learning'], ['task-1-2-8']));

allTasks.push(createTask('task-1-2-10', 'Learning: CSRF attack mechanics',
  'Understand CSRF attack flow, Token-based protection, SameSite cookies, Referer header validation',
  1, 1, 3, 'high', 8, ['security', 'csrf', 'learning'], ['task-1-2-9']));

allTasks.push(createTask('task-1-2-11', 'Learning: XSS and CSRF prevention',
  'Study Content Security Policy (CSP), CSRF tokens, Input sanitization, Output encoding, Secure headers',
  1, 1, 3, 'high', 8, ['security', 'prevention', 'learning'], ['task-1-2-10']));

allTasks.push(createTask('task-1-2-12', 'Project: Solve XSS challenges on XSS game',
  'Complete all levels of Google XSS game, understand different XSS types and exploitation techniques',
  1, 1, 3, 'high', 8, ['security', 'project', 'web', 'xss'], ['task-1-2-9']));

allTasks.push(createTask('task-1-2-13', 'Practice: PortSwigger XSS labs',
  'Complete PortSwigger Web Security Academy XSS labs, Practice all XSS types',
  1, 1, 3, 'high', 6, ['security', 'practice', 'portswigger'], ['task-1-2-9']));

allTasks.push(createTask('task-1-2-14', 'Practice: PortSwigger CSRF labs',
  'Complete PortSwigger Web Security Academy CSRF labs, Practice CSRF exploitation and prevention',
  1, 1, 3, 'high', 4, ['security', 'practice', 'portswigger'], ['task-1-2-10']));

// Month 1, Week 4 - Authentication & Access Control
allTasks.push(createTask('task-1-2-15', 'Web Application Security - Week 3: Authentication & Access Control',
  'Learn Session management, JWT tokens, OAuth 2.0 basics, Password security, Multi-factor authentication. Practice on PortSwigger Academy',
  1, 1, 4, 'critical', 40, ['security', 'web', 'authentication'], ['task-1-2-7']));

allTasks.push(createTask('task-1-2-16', 'Learning: Session management',
  'Study session creation, session storage, session fixation, session hijacking, secure session handling',
  1, 1, 4, 'high', 8, ['security', 'authentication', 'sessions'], ['task-1-2-15']));

allTasks.push(createTask('task-1-2-17', 'Learning: JWT tokens',
  'Understand JWT structure, JWT signing, JWT validation, JWT vulnerabilities, Secure JWT implementation',
  1, 1, 4, 'high', 8, ['security', 'jwt', 'tokens'], ['task-1-2-15']));

allTasks.push(createTask('task-1-2-18', 'Learning: OAuth 2.0 basics',
  'Study OAuth 2.0 flow, Authorization codes, Access tokens, Refresh tokens, OAuth vulnerabilities',
  1, 1, 4, 'high', 8, ['security', 'oauth', 'authentication'], ['task-1-2-15']));

allTasks.push(createTask('task-1-2-19', 'Learning: Password security',
  'Study password hashing (bcrypt, Argon2), Password policies, Password reset flows, Account lockout mechanisms',
  1, 1, 4, 'high', 8, ['security', 'passwords', 'authentication'], ['task-1-2-15']));

allTasks.push(createTask('task-1-2-20', 'Learning: Multi-factor authentication',
  'Study MFA types (SMS, TOTP, hardware tokens), MFA implementation, MFA bypass techniques, MFA best practices',
  1, 1, 4, 'high', 8, ['security', 'mfa', 'authentication'], ['task-1-2-15']));

allTasks.push(createTask('task-1-2-21', 'Project: Complete PortSwigger Academy free labs',
  'Complete beginner and intermediate labs on PortSwigger Web Security Academy: Authentication, Access control, JWT, OAuth',
  1, 1, 4, 'high', 20, ['security', 'project', 'web', 'practice'], ['task-1-2-15']));

allTasks.push(createTask('task-1-2-22', 'Practice: Try 10 easy boxes on HackTheBox',
  'Complete 10 easy boxes on HackTheBox, Focus on web application vulnerabilities, Document findings',
  1, 1, 4, 'high', 40, ['security', 'practice', 'hackthebox'], ['task-1-2-21']));

allTasks.push(createTask('task-1-2-23', 'Mini-Project: Build vulnerable web app and fix it',
  'Create a simple blog with SQL injection vulnerability, exploit it yourself, fix the vulnerability, document the process',
  1, 1, 4, 'high', 16, ['security', 'project', 'web', 'full-project'], ['task-1-2-21']));

allTasks.push(createTask('task-1-2-24', 'Checkpoint: Web Application Security',
  'Verify: Successfully exploited and fixed 5 different vulnerability types? Understand authentication mechanisms? Can identify web vulnerabilities?',
  1, 1, 4, 'high', 0, ['checkpoint', 'review'], ['task-1-2-23']));

// Continue with Month 2 tasks...
// Month 2, Week 1 - Network Security Reconnaissance
allTasks.push(createTask('task-1-3', 'Network Security & Pentesting - Week 1: Reconnaissance',
  'Learn Passive reconnaissance (OSINT), Active reconnaissance (scanning), Learn Nmap thoroughly, Service fingerprinting, OS detection, Vulnerability scanning basics',
  1, 2, 1, 'critical', 40, ['security', 'networking', 'pentesting', 'nmap']));

allTasks.push(createTask('task-1-3-1', 'Learning: Passive reconnaissance (OSINT)',
  'Study OSINT techniques, Google dorking, Social media reconnaissance, Domain information gathering, Subdomain enumeration',
  1, 2, 1, 'high', 8, ['security', 'osint', 'reconnaissance'], ['task-1-3']));

allTasks.push(createTask('task-1-3-2', 'Learning: Active reconnaissance (scanning)',
  'Study network scanning techniques, Port scanning methods, Service enumeration, Banner grabbing',
  1, 2, 1, 'high', 8, ['security', 'scanning', 'reconnaissance'], ['task-1-3']));

allTasks.push(createTask('task-1-3-3', 'Learning: Nmap thoroughly',
  'Master Nmap syntax, Scan types (TCP, UDP, SYN, ACK), NSE scripts, Advanced Nmap options, Nmap output interpretation',
  1, 2, 1, 'critical', 12, ['security', 'nmap', 'learning'], ['task-1-3-2']));

allTasks.push(createTask('task-1-3-4', 'Learning: Service fingerprinting',
  'Study service version detection, Protocol identification, Application fingerprinting, Service enumeration techniques',
  1, 2, 1, 'high', 8, ['security', 'fingerprinting', 'learning'], ['task-1-3-3']));

allTasks.push(createTask('task-1-3-5', 'Learning: OS detection',
  'Study OS fingerprinting techniques, TCP/IP stack fingerprinting, OS detection tools, OS detection evasion',
  1, 2, 1, 'high', 4, ['security', 'os-detection', 'learning'], ['task-1-3-3']));

allTasks.push(createTask('task-1-3-6', 'Learning: Vulnerability scanning basics',
  'Study vulnerability scanners (Nessus, OpenVAS), CVE databases, Vulnerability assessment methodology, False positive handling',
  1, 2, 1, 'high', 8, ['security', 'vulnerability-scanning', 'learning'], ['task-1-3-3']));

allTasks.push(createTask('task-1-3-7', 'Project: Nmap Mastery - Scan home network',
  'Scan your home network, try all scan types, use NSE scripts, parse and understand output, document findings',
  1, 2, 1, 'high', 12, ['security', 'project', 'networking', 'nmap'], ['task-1-3-3']));

allTasks.push(createTask('task-1-3-8', 'Practice: TryHackMe Nmap room',
  'Complete TryHackMe Nmap room, Practice all scan types, Use NSE scripts',
  1, 2, 1, 'high', 4, ['security', 'practice', 'tryhackme'], ['task-1-3-3']));

allTasks.push(createTask('task-1-3-9', 'Learning: "Nmap Network Scanning" official book',
  'Read "Nmap Network Scanning" official book (free PDF), Study advanced techniques',
  1, 2, 1, 'medium', 8, ['security', 'learning', 'nmap', 'book'], ['task-1-3-3']));

// Month 2, Week 2 - Exploitation Basics
allTasks.push(createTask('task-1-3-10', 'Network Security - Week 2: Exploitation Basics',
  'Learn Metasploit Framework introduction, Exploit vs payload concepts, Basic exploit techniques, Post-exploitation basics, Privilege escalation overview',
  1, 2, 2, 'critical', 40, ['security', 'pentesting', 'metasploit'], ['task-1-3']));

allTasks.push(createTask('task-1-3-11', 'Learning: Metasploit Framework introduction',
  'Install Metasploit, Understand Metasploit architecture, Learn msfconsole, Basic commands, Module types',
  1, 2, 2, 'critical', 8, ['security', 'metasploit', 'learning'], ['task-1-3-10']));

allTasks.push(createTask('task-1-3-12', 'Learning: Exploit vs payload concepts',
  'Understand exploit modules, Payload types, Encoders, NOPs, Handlers',
  1, 2, 2, 'high', 8, ['security', 'metasploit', 'learning'], ['task-1-3-11']));

allTasks.push(createTask('task-1-3-13', 'Learning: Basic exploit techniques',
  'Study exploit selection, Exploit execution, Payload generation, Session management',
  1, 2, 2, 'high', 8, ['security', 'exploitation', 'learning'], ['task-1-3-12']));

allTasks.push(createTask('task-1-3-14', 'Learning: Post-exploitation basics',
  'Study meterpreter basics, File system access, Network pivoting, Data exfiltration, Persistence',
  1, 2, 2, 'high', 8, ['security', 'post-exploitation', 'learning'], ['task-1-3-13']));

allTasks.push(createTask('task-1-3-15', 'Learning: Privilege escalation overview',
  'Study Windows privilege escalation, Linux privilege escalation, Kernel exploits, Misconfigurations',
  1, 2, 2, 'high', 8, ['security', 'privilege-escalation', 'learning'], ['task-1-3-14']));

allTasks.push(createTask('task-1-3-16', 'Project: Metasploit Practice - Exploit Metasploitable VM',
  'Try 5 different exploits on Metasploitable VM, understand payload options, practice post-exploitation, document process',
  1, 2, 2, 'high', 16, ['security', 'project', 'pentesting', 'metasploit'], ['task-1-3-13']));

allTasks.push(createTask('task-1-3-17', 'Learning: Metasploit Unleashed',
  'Complete Metasploit Unleashed (free course), Study all modules, Practice exercises',
  1, 2, 2, 'high', 12, ['security', 'learning', 'metasploit'], ['task-1-3-11']));

allTasks.push(createTask('task-1-3-18', 'Practice: TryHackMe Metasploit room',
  'Complete TryHackMe Metasploit room, Practice exploitation, Practice post-exploitation',
  1, 2, 2, 'high', 4, ['security', 'practice', 'tryhackme'], ['task-1-3-13']));

// Month 2, Week 3 - Network Defense
allTasks.push(createTask('task-1-3-19', 'Network Security - Week 3: Network Defense',
  'Learn Firewall configuration, IDS/IPS setup (Snort/Suricata), Log analysis basics, Incident detection, Network segmentation',
  1, 2, 3, 'high', 40, ['security', 'defense', 'ids', 'ips'], ['task-1-3-10']));

allTasks.push(createTask('task-1-3-20', 'Learning: Firewall configuration',
  'Study firewall types, Firewall rules, NAT configuration, DMZ setup, Firewall best practices',
  1, 2, 3, 'high', 8, ['security', 'firewall', 'learning'], ['task-1-3-19']));

allTasks.push(createTask('task-1-3-21', 'Learning: IDS/IPS setup (Snort/Suricata)',
  'Study IDS vs IPS, Snort installation, Suricata installation, Rule writing, Alert management',
  1, 2, 3, 'high', 12, ['security', 'ids', 'ips', 'learning'], ['task-1-3-19']));

allTasks.push(createTask('task-1-3-22', 'Learning: Log analysis basics',
  'Study log types, Log aggregation, Log parsing, Log analysis tools, SIEM basics',
  1, 2, 3, 'high', 8, ['security', 'logs', 'analysis', 'learning'], ['task-1-3-19']));

allTasks.push(createTask('task-1-3-23', 'Learning: Incident detection',
  'Study threat indicators, Anomaly detection, Alert correlation, Incident response basics',
  1, 2, 3, 'high', 8, ['security', 'incident-response', 'learning'], ['task-1-3-22']));

allTasks.push(createTask('task-1-3-24', 'Learning: Network segmentation',
  'Study VLANs, Subnetting, Network isolation, Zero trust principles, Segmentation best practices',
  1, 2, 3, 'high', 4, ['security', 'networking', 'segmentation', 'learning'], ['task-1-3-19']));

allTasks.push(createTask('task-1-3-25', 'Project: Network Defense - Set up pfSense and Snort',
  'Set up pfSense firewall VM, configure Snort IDS, generate alerts, analyze Snort logs, document configuration',
  1, 2, 3, 'high', 16, ['security', 'project', 'defense', 'ids'], ['task-1-3-21']));

allTasks.push(createTask('task-1-3-26', 'Practice: TryHackMe Network Security room',
  'Complete TryHackMe Network Security room, Practice defense techniques',
  1, 2, 3, 'high', 4, ['security', 'practice', 'tryhackme'], ['task-1-3-19']));

// Month 2, Week 4 - Linux & System Administration
allTasks.push(createTask('task-1-3-27', 'Mini-Project: Home Network Security Assessment',
  'Map your home network, identify all devices, scan for vulnerabilities, create a security report, implement improvements',
  1, 2, 4, 'high', 20, ['security', 'project', 'full-project', 'assessment'], ['task-1-3-25']));

allTasks.push(createTask('task-1-3-28', 'Checkpoint: Network Security & Pentesting',
  'Verify: Can you scan, enumerate, and exploit a vulnerable system? Understand network defense? Can use Metasploit?',
  1, 2, 4, 'high', 0, ['checkpoint', 'review'], ['task-1-3-27']));

allTasks.push(createTask('task-1-4', 'Linux & System Administration - Week 1: Linux Essentials',
  'Learn File operations (cp, mv, rm, find, grep), Permissions (chmod, chown, ACLs), Process management (ps, top, kill), Network commands (ifconfig, netstat, ss), Service management (systemctl)',
  1, 2, 4, 'high', 40, ['linux', 'system-admin']));

allTasks.push(createTask('task-1-4-1', 'Learning: File operations',
  'Master cp, mv, rm, find, grep, locate, which, whereis, file operations, text processing',
  1, 2, 4, 'high', 8, ['linux', 'file-operations', 'learning'], ['task-1-4']));

allTasks.push(createTask('task-1-4-2', 'Learning: Permissions',
  'Study chmod, chown, ACLs, umask, sticky bits, SUID/SGID, file permissions, directory permissions',
  1, 2, 4, 'high', 8, ['linux', 'permissions', 'learning'], ['task-1-4-1']));

allTasks.push(createTask('task-1-4-3', 'Learning: Process management',
  'Study ps, top, htop, kill, killall, pkill, jobs, fg, bg, nohup, process priorities',
  1, 2, 4, 'high', 8, ['linux', 'processes', 'learning'], ['task-1-4-1']));

allTasks.push(createTask('task-1-4-4', 'Learning: Network commands',
  'Master ifconfig, ip, netstat, ss, route, arp, ping, traceroute, dig, nslookup',
  1, 2, 4, 'high', 8, ['linux', 'networking', 'learning'], ['task-1-4-1']));

allTasks.push(createTask('task-1-4-5', 'Learning: Service management',
  'Study systemctl, service, systemd, init scripts, service status, service logs, service dependencies',
  1, 2, 4, 'high', 8, ['linux', 'services', 'learning'], ['task-1-4-1']));

allTasks.push(createTask('task-1-4-6', 'Project: Install Ubuntu Server and configure via CLI',
  'Install Ubuntu Server (no GUI), configure everything via command line, set up SSH server, configure firewall (ufw/iptables), set up log rotation, schedule tasks with cron',
  1, 2, 4, 'high', 12, ['linux', 'project', 'system-admin'], ['task-1-4']));

allTasks.push(createTask('task-1-4-7', 'Learning: "The Linux Command Line" by William Shotts',
  'Read "The Linux Command Line" by William Shotts (free PDF), Complete exercises',
  1, 2, 4, 'high', 12, ['linux', 'learning', 'book'], ['task-1-4']));

allTasks.push(createTask('task-1-4-8', 'Practice: Linux Journey website',
  'Complete Linux Journey website tutorials, Practice all concepts',
  1, 2, 4, 'high', 8, ['linux', 'practice', 'tutorial'], ['task-1-4']));

allTasks.push(createTask('task-1-4-9', 'Practice: OverTheWire Bandit wargame',
  'Complete OverTheWire: Bandit wargame, Practice Linux commands, Practice security concepts',
  1, 2, 4, 'high', 12, ['linux', 'practice', 'wargame'], ['task-1-4']));

allTasks.push(createTask('task-1-4-10', 'Practice: TryHackMe Linux Fundamentals',
  'Complete TryHackMe Linux Fundamentals path, Practice all Linux concepts',
  1, 2, 4, 'high', 8, ['linux', 'practice', 'tryhackme'], ['task-1-4']));

allTasks.push(createTask('task-1-4-11', 'Linux - Week 2: Bash Scripting',
  'Learn Variables and loops, Conditional statements, Functions, Text processing (sed, awk, cut), File operations in scripts, Error handling',
  1, 2, 4, 'high', 40, ['linux', 'bash', 'scripting'], ['task-1-4']));

allTasks.push(createTask('task-1-4-12', 'Learning: Bash scripting basics',
  'Study variables, arrays, loops (for, while), conditionals (if/else), functions, parameters',
  1, 2, 4, 'high', 8, ['bash', 'scripting', 'learning'], ['task-1-4-11']));

allTasks.push(createTask('task-1-4-13', 'Learning: Text processing',
  'Master sed, awk, cut, grep, sort, uniq, tr, paste, join, text manipulation',
  1, 2, 4, 'high', 8, ['bash', 'text-processing', 'learning'], ['task-1-4-12']));

allTasks.push(createTask('task-1-4-14', 'Learning: File operations in scripts',
  'Study file reading, file writing, file manipulation, directory operations, file testing',
  1, 2, 4, 'high', 8, ['bash', 'file-operations', 'learning'], ['task-1-4-12']));

allTasks.push(createTask('task-1-4-15', 'Learning: Error handling',
  'Study exit codes, error checking, trap command, set -e, set -u, error logging',
  1, 2, 4, 'high', 8, ['bash', 'error-handling', 'learning'], ['task-1-4-12']));

allTasks.push(createTask('task-1-4-16', 'Project: Create 5 Bash scripts',
  'Build: System monitoring script (CPU, memory, disk), Log analyzer for failed SSH attempts, Automated backup script, Port scanner in bash, File integrity checker',
  1, 2, 4, 'high', 20, ['linux', 'project', 'bash', 'scripting'], ['task-1-4-11']));

allTasks.push(createTask('task-1-4-17', 'Checkpoint: Linux & System Administration',
  'Verify: Comfortable working entirely in Linux terminal? Can write bash scripts? Understand system administration?',
  1, 2, 4, 'high', 0, ['checkpoint', 'review'], ['task-1-4-16']));

allTasks.push(createTask('task-1-5', 'Security Certifications Preparation - eJPT or Security+',
  'Choose eJPT (more practical, ~$200) or Security+ (more comprehensive, ~$370). Study 2-3 hours daily, watch all video lectures, take detailed notes, complete practice questions, do hands-on labs, take practice exams, schedule and take certification',
  1, 2, 4, 'high', 80, ['certification', 'security']));

allTasks.push(createTask('task-1-5-1', 'Option A: eJPT Preparation',
  'Focus: Hands-on penetration testing. Study: INE eJPT course materials. Practice: TryHackMe, HackTheBox. Cost: ~$200',
  1, 2, 4, 'high', 40, ['certification', 'ejpt', 'pentesting'], ['task-1-5']));

allTasks.push(createTask('task-1-5-2', 'Option B: Security+ Preparation',
  'Focus: Broad security concepts. Study: Professor Messer videos + practice tests. Practice: CompTIA CertMaster Practice. Cost: ~$370',
  1, 2, 4, 'high', 40, ['certification', 'security-plus', 'comptia'], ['task-1-5']));

allTasks.push(createTask('task-1-5-3', 'Certification: Take practice exams',
  'Take multiple practice exams, Review weak areas, Focus on hands-on labs, Prepare for exam format',
  1, 2, 4, 'high', 20, ['certification', 'practice', 'exam'], ['task-1-5-1', 'task-1-5-2']));

allTasks.push(createTask('task-1-5-4', 'Certification: Schedule and take exam',
  'Schedule certification exam, Take exam, Pass certification, Update resume',
  1, 2, 4, 'high', 4, ['certification', 'exam'], ['task-1-5-3']));

allTasks.push(createTask('task-1-5-5', 'Checkpoint: Security Certifications',
  'Verify: Passed certification exam? Understand security concepts? Ready for next phase?',
  1, 2, 4, 'high', 0, ['checkpoint', 'review'], ['task-1-5-4']));

console.log(`Generated ${allTasks.length} tasks for Phase 0 and Phase 1...`);

// Continue with Phase 2, 3, 4, 5, 6, 7, 8, 9, 10, 11...
// Due to the massive scope, I'll need to continue adding all remaining tasks
// Let me save what we have and continue...

// Save progress
const output = {
  tasks: allTasks,
  total: allTasks.length
};

fs.writeFileSync(
  path.join(__dirname, 'tasks-phase0-1.json'),
  JSON.stringify(output, null, 2)
);

console.log(`Saved ${allTasks.length} tasks to tasks-phase0-1.json`);
