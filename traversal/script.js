// Node class for creating tree nodes
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Binary Search Tree class
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    // Insert into BST
    insert(value) {
        const newNode = new Node(value);
        
        if (!this.root) {
            this.root = newNode;
            return;
        }

        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    break;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    break;
                }
                current = current.right;
            }
        }
    }

    // Traversal methods
    preOrder(node = this.root, result = []) {
        if (node) {
            result.push(node.value);
            this.preOrder(node.left, result);
            this.preOrder(node.right, result);
        }
        return result;
    }

    inOrder(node = this.root, result = []) {
        if (node) {
            this.inOrder(node.left, result);
            result.push(node.value);
            this.inOrder(node.right, result);
        }
        return result;
    }

    postOrder(node = this.root, result = []) {
        if (node) {
            this.postOrder(node.left, result);
            this.postOrder(node.right, result);
            result.push(node.value);
        }
        return result;
    }
}

// Helper function to validate input
function validateInput(input) {
    const cleanInput = input.replace(/[^\d,\s]/g, '').trim();
    if (!cleanInput) return false;
    
    const numbers = cleanInput.split(/[,\s]+/).filter(num => num.trim() !== '');
    return numbers.length > 0 && numbers.every(num => !isNaN(num) && num.trim() !== '');
}

// Helper function to parse input string into array of numbers
function parseInput(input) {
    return input.replace(/[^\d,\s]/g, '')
                .split(/[,\s]+/)
                .filter(num => num.trim() !== '')
                .map(num => parseInt(num.trim()));
}

// Function to create tree nodes in DOM
function createTreeNode(value) {
    const node = document.createElement('div');
    node.className = 'tree-node bg-white border-2 border-purple-500 rounded-full w-12 h-12 flex items-center justify-center font-semibold text-purple-600 relative z-10';
    node.setAttribute('data-value', value);
    node.textContent = value;
    return node;
}

// Function to draw connecting lines
function drawConnectingLines(container, levels) {
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.zIndex = "1";
    container.insertBefore(svg, container.firstChild);

    // Get all nodes
    const nodes = container.querySelectorAll('.tree-node');
    const nodeArray = Array.from(nodes);
    let processedNodes = new Set();

    // Process each level
    let currentIndex = 0;
    levels.forEach((level, levelIndex) => {
        level.forEach((node) => {
            const parentElement = nodeArray[currentIndex];
            if (!processedNodes.has(parentElement)) {
                const parentRect = parentElement.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                // Draw line to left child if exists
                if (node.left) {
                    const leftChildIndex = nodeArray.findIndex(el => 
                        parseInt(el.getAttribute('data-value')) === node.left.value
                    );
                    const leftChildElement = nodeArray[leftChildIndex];
                    const leftChildRect = leftChildElement.getBoundingClientRect();

                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", parentRect.left - containerRect.left + parentRect.width / 2);
                    line.setAttribute("y1", parentRect.top - containerRect.top + parentRect.height / 2);
                    line.setAttribute("x2", leftChildRect.left - containerRect.left + leftChildRect.width / 2);
                    line.setAttribute("y2", leftChildRect.top - containerRect.top + leftChildRect.height / 2);
                    line.setAttribute("stroke", "#9F7AEA");
                    line.setAttribute("stroke-width", "2");
                    svg.appendChild(line);
                }

                // Draw line to right child if exists
                if (node.right) {
                    const rightChildIndex = nodeArray.findIndex(el => 
                        parseInt(el.getAttribute('data-value')) === node.right.value
                    );
                    const rightChildElement = nodeArray[rightChildIndex];
                    const rightChildRect = rightChildElement.getBoundingClientRect();

                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", parentRect.left - containerRect.left + parentRect.width / 2);
                    line.setAttribute("y1", parentRect.top - containerRect.top + parentRect.height / 2);
                    line.setAttribute("x2", rightChildRect.left - containerRect.left + rightChildRect.width / 2);
                    line.setAttribute("y2", rightChildRect.top - containerRect.top + rightChildRect.height / 2);
                    line.setAttribute("stroke", "#9F7AEA");
                    line.setAttribute("stroke-width", "2");
                    svg.appendChild(line);
                }

                processedNodes.add(parentElement);
            }
            currentIndex++;
        });
    });
}

// Function to visualize the tree
function visualizeTree(root, container) {
    container.innerHTML = '';
    if (!root) return;

    const treeContainer = document.createElement('div');
    treeContainer.className = 'relative pt-8';
    treeContainer.style.minHeight = '400px';
    container.appendChild(treeContainer);

    const levels = [];
    const queue = [{node: root, level: 0}];
    
    while (queue.length > 0) {
        const {node, level} = queue.shift();
        
        if (!levels[level]) {
            levels[level] = [];
        }
        
        levels[level].push(node);
        
        if (node.left) queue.push({node: node.left, level: level + 1});
        if (node.right) queue.push({node: node.right, level: level + 1});
    }
    
    // Create and position nodes
    levels.forEach((level, i) => {
        const levelDiv = document.createElement('div');
        levelDiv.className = `tree-level flex justify-center items-center space-x-8 mb-16`;
        
        level.forEach(node => {
            const nodeDiv = createTreeNode(node.value);
            levelDiv.appendChild(nodeDiv);
        });
        
        treeContainer.appendChild(levelDiv);
    });

    // Draw connecting lines after nodes are positioned
    setTimeout(() => drawConnectingLines(treeContainer, levels), 100);
}

// Function to highlight nodes during traversal
function highlightTraversal(traversalArray) {
    let currentIndex = 0;
    const nodes = document.querySelectorAll('.tree-node');
    
    function highlight() {
        if (currentIndex >= traversalArray.length) {
            nodes.forEach(node => node.classList.remove('highlight'));
            return;
        }
        
        nodes.forEach(node => node.classList.remove('highlight'));
        const value = traversalArray[currentIndex];
        const node = Array.from(nodes).find(node => 
            parseInt(node.getAttribute('data-value')) === value
        );
        
        if (node) {
            node.classList.add('highlight');
            currentIndex++;
            setTimeout(highlight, 1000);
        }
    }
    
    highlight();
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        // Index page initialization
        const generateBtn = document.getElementById('generate-btn');
        const inputField = document.getElementById('numbers');
        const errorMessage = document.getElementById('error-message');

        if (generateBtn && inputField && errorMessage) {
            // Clear placeholder on focus
            inputField.addEventListener('focus', () => {
                if (inputField.value === inputField.placeholder) {
                    inputField.value = '';
                }
            });

            generateBtn.addEventListener('click', () => {
                const input = inputField.value;
                if (!validateInput(input)) {
                    errorMessage.classList.remove('hidden');
                    return;
                }
                
                errorMessage.classList.add('hidden');
                const numbers = parseInput(input);
                localStorage.setItem('treeData', JSON.stringify(numbers));
                window.location.href = 'tree.html';
            });
        }
    } else if (window.location.pathname.endsWith('tree.html')) {
        // Tree visualization page initialization
        const treeContainer = document.getElementById('tree-container');
        const errorMessage = document.getElementById('error-message');
        
        if (treeContainer && errorMessage) {
            const treeData = localStorage.getItem('treeData');
            if (!treeData) {
                errorMessage.classList.remove('hidden');
                treeContainer.style.display = 'none';
                return;
            }
            
            const numbers = JSON.parse(treeData);
            const tree = new BinarySearchTree();
            numbers.forEach(num => tree.insert(num));
            
            visualizeTree(tree.root, treeContainer);
            
            // Add event listeners for traversal buttons
            const preOrderBtn = document.getElementById('pre-order');
            const inOrderBtn = document.getElementById('in-order');
            const postOrderBtn = document.getElementById('post-order');
            
            if (preOrderBtn && inOrderBtn && postOrderBtn) {
                preOrderBtn.addEventListener('click', () => {
                    const traversal = tree.preOrder();
                    highlightTraversal(traversal);
                });
                
                inOrderBtn.addEventListener('click', () => {
                    const traversal = tree.inOrder();
                    highlightTraversal(traversal);
                });
                
                postOrderBtn.addEventListener('click', () => {
                    const traversal = tree.postOrder();
                    highlightTraversal(traversal);
                });
            }
        }
    }
});