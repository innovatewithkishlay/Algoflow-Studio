import Arrays from '../pages/data-structures/Arrays';
import LinkedList from '../pages/data-structures/LinkedList';
import Stack from '../pages/data-structures/Stack';
import Queue from '../pages/data-structures/Queue';
import Tree from '../pages/data-structures/Tree';
import Graph from '../pages/data-structures/Graph';
import Heap from '../pages/data-structures/Heap';
import Backtracking from '../pages/data-structures/Backtracking';
import HashTable from '../pages/data-structures/HashTable';
import Trie from '../pages/data-structures/Trie';
import DisjointSet from '../pages/data-structures/DisjointSet';
import SegmentTree from '../pages/data-structures/SegmentTree';
import FenwickTree from '../pages/data-structures/FenwickTree';
import PriorityQueue from '../pages/data-structures/PriorityQueue';
import BloomFilter from '../pages/data-structures/BloomFilter';
import AVLTree from '../pages/data-structures/AVLTree';
import RedBlackTree from '../pages/data-structures/RedBlackTree';
import BTree from '../pages/data-structures/BTree';
import BPlusTree from '../pages/data-structures/BPlusTree';
import SuffixTrie from '../pages/data-structures/SuffixTrie';
import SuffixArray from '../pages/data-structures/SuffixArray';
import Treap from '../pages/data-structures/Treap';
import IntervalTree from '../pages/data-structures/IntervalTree';
import KDTree from '../pages/data-structures/KDTree';
import PatriciaTrie from '../pages/data-structures/PatriciaTrie';
import OSTree from '../pages/data-structures/OSTree';

export interface DataStructure {
  id: string;
  name: string;
  description: string;
  category: 'linear' | 'non-linear' | 'hierarchical' | 'graph';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  component: React.ComponentType | null;
  icon: string;
  features: string[];
  timeComplexity: {
    access: string;
    search: string;
    insertion: string;
    deletion: string;
  };
  spaceComplexity: string;
  useCases: string[];
}

export const dataStructures: DataStructure[] = [
  {
  id: 'order-statistic-tree',
  name: 'Order Statistic Tree',
  description: 'A binary search tree augmented with subtree sizes to support rank and select operations efficiently.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: OSTree,
  icon: 'bi-sort-numeric-down',
  features: [
    'Supports rank and select queries',
    'Augmented BST with subtree sizes',
    'O(log n) query and update time'
  ],
  timeComplexity: {
    access: 'O(log n)',
    search: 'O(log n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Statistics and ranking',
    'Databases and selection queries',
    'Competitive programming'
  ]
},
  {
  id: 'patricia-trie',
  name: 'Patricia Trie',
  description: 'A compressed trie (Radix Trie) that merges chains of single-child nodes for space-efficient string storage and fast prefix search.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: PatriciaTrie,
  icon: 'bi-tree',
  features: [
    'Compressed trie with path compression',
    'Efficient prefix search and insertion',
    'Space-optimized compared to standard tries',
    'Used in IP routing and dictionary compression'
  ],
  timeComplexity: {
    access: 'O(k)',
    search: 'O(k)',
    insertion: 'O(k)',
    deletion: 'O(k)'
  },
  spaceComplexity: 'O(nk)',
  useCases: [
    'IP routing',
    'Dictionary compression',
    'Prefix search in text processing'
  ]
},
  {
  id: 'kd-tree',
  name: 'KD-Tree',
  description: 'A binary tree for multidimensional points that recursively partitions space by alternating splitting axes.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: KDTree,
  icon: 'bi-bricks',
  features: [
    'Recursive k-dimensional space partitioning',
    'Efficient range and nearest neighbor queries',
    'Widely used in spatial databases and graphics'
  ],
  timeComplexity: {
    access: 'O(log n)',
    search: 'O(n^{1-1/k} + m)', // k = dimensions, m = results
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Spatial databases',
    'Computer graphics',
    'Machine learning'
  ]
},
  {
  id: 'interval-tree',
  name: 'Interval Tree',
  description: 'A balanced binary search tree storing intervals to efficiently find all intervals overlapping with a given interval.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: IntervalTree,
  icon: 'bi-diagram-3',
  features: [
    'Stores intervals with max high endpoint',
    'Efficient overlap queries',
    'Balanced BST structure'
  ],
  timeComplexity: {
    access: 'O(log n)',
    search: 'O(log n + k)', // k = number of overlaps
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Scheduling conflicts',
    'Computational geometry',
    'Genome analysis'
  ]
},
  {
  id: 'treap',
  name: 'Treap',
  description: 'A randomized balanced binary search tree combining BST and heap properties with rotations.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: Treap,
  icon: 'bi-tree',
  features: [
    'Maintains BST and heap properties',
    'Randomized balancing',
    'Expected O(log n) insert/search/delete',
    'Uses rotations to maintain heap property'
  ],
  timeComplexity: {
    access: 'O(log n)',
    search: 'O(log n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Balanced BST alternative',
    'Randomized data structures',
    'Advanced algorithms'
  ]
},
  {
  id: 'suffix-array',
  name: 'Suffix Array',
  description: 'A space-efficient array of all suffixes of a string in sorted order, enabling fast substring and pattern matching.',
  category: 'linear',
  difficulty: 'advanced',
  component: SuffixArray,
  icon: 'bi-list-ol',
  features: [
    'All suffixes sorted lexicographically',
    'Fast substring/pattern search',
    'Space-efficient for large texts',
    'Foundation for advanced text algorithms'
  ],
  timeComplexity: {
    access: 'O(1)',
    search: 'O(m log n)',
    insertion: 'O(n² log n)', 
    deletion: 'O(n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Substring search',
    'Pattern matching',
    'Bioinformatics (DNA search)',
    'Full-text indexing'
  ]
},
  {
  id: 'suffix-trie',
  name: 'Suffix Trie',
  description: 'A trie that contains all the suffixes of a given string, enabling fast substring search and pattern matching.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: SuffixTrie,
  icon: 'bi-diagram-2',
  features: [
    'All suffixes stored',
    'Fast substring/pattern search',
    'Space-efficient for repeated substrings',
    'Foundation for advanced text algorithms'
  ],
  timeComplexity: {
    access: 'O(m)', // m = length of query string
    search: 'O(m)',
    insertion: 'O(n^2)', // n = length of original string
    deletion: 'O(n^2)'
  },
  spaceComplexity: 'O(n^2)',
  useCases: [
    'Substring search',
    'Pattern matching',
    'Bioinformatics (DNA search)',
    'Plagiarism detection'
  ]
},
  {
  id: 'b-plus-tree',
  name: 'B+ Tree',
  description: 'A self-balancing multi-way search tree where all data is stored in the leaves, and internal nodes only direct the search. Used for database and filesystem indexing.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: BPlusTree,
  icon: 'bi-diagram-2',
  features: [
    'All data at leaf level',
    'Internal nodes for routing',
    'Leaves linked for fast range queries',
    'Used in databases and filesystems'
  ],
  timeComplexity: {
    access: 'O(log n)',
    search: 'O(log n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Database indexing',
    'Filesystem storage',
    'Efficient range queries',
    'Large-scale sorted data'
  ]
},
  {
  id: 'b-tree',
  name: 'B-Tree',
  description: 'A self-balancing multi-way search tree used in databases and filesystems, allowing nodes to contain multiple keys and children for efficient, balanced storage and retrieval.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: BTree,
  icon: 'bi-diagram-2',
  features: [
    'Multi-way branching',
    'Node splitting and balancing',
    'O(log n) search/insert/delete',
    'Used in databases/filesystems'
  ],
  timeComplexity: {
    access: 'O(log n)',
    search: 'O(log n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Database indexing',
    'Filesystems',
    'Range queries',
    'Efficient large-scale storage'
  ]
},
  {
  id: 'red-black-tree',
  name: 'Red-Black Tree',
  description: 'A self-balancing binary search tree with node coloring rules to guarantee O(log n) search, insertion, and deletion.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: RedBlackTree,
  icon: 'bi-circle-half',
  features: [
    'Self-balancing BST',
    'Red/black coloring rules',
    'O(log n) insert/search/delete',
    'Automatic balancing via rotations'
  ],
  timeComplexity: {
    access: 'O(log n)',
    search: 'O(log n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Database indexing',
    'Ordered maps/sets',
    'Real-time systems',
    'Efficient sorted storage'
  ]
},
  {
  id: 'avl-tree',
  name: 'AVL Tree',
  description: 'A self-balancing binary search tree that maintains O(log n) height by performing rotations after insertions and deletions.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: AVLTree,
  icon: 'bi-diagram-2',
  features: [
    'Self-balancing BST',
    'Automatic rotations',
    'O(log n) insert/search/delete',
    'Maintains height balance'
  ],
  timeComplexity: {
    access: 'O(log n)',
    search: 'O(log n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Database indexing',
    'Range queries',
    'Ordered maps/sets',
    'Real-time systems'
  ]
},
  {
  id: 'bloom-filter',
  name: 'Bloom Filter',
  description: 'A probabilistic data structure for set membership queries, allowing false positives but no false negatives.',
  category: 'linear',
  difficulty: 'advanced',
  component: BloomFilter,
  icon: 'bi-funnel',
  features: [
    'Probabilistic membership testing',
    'Space-efficient',
    'No false negatives',
    'Multiple hash functions'
  ],
  timeComplexity: {
    access: 'O(1)',
    search: 'O(k)',
    insertion: 'O(k)',
    deletion: 'N/A'
  },
  spaceComplexity: 'O(m)',
  useCases: [
    'Database query optimization',
    'Web cache filtering',
    'Network packet analysis',
    'Spell checking'
  ]
},
  {
  id: 'priority-queue',
  name: 'Priority Queue',
  description: 'A data structure that allows elements to be processed based on priority rather than insertion order.',
  category: 'linear',
  difficulty: 'intermediate',
  component: PriorityQueue,
  icon: 'bi-arrow-up-circle',
  features: [
    'Elements with priorities',
    'Efficient insert and extract-max',
    'Heap-based implementation',
    'Dynamic priority updates'
  ],
  timeComplexity: {
    access: 'O(1)',
    search: 'O(n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Task scheduling',
    'Dijkstra’s algorithm',
    'Event-driven simulations',
    'Load balancing'
  ]
},
  {
  id: 'fenwick-tree',
  name: 'Fenwick Tree',
  description: 'A data structure that efficiently supports prefix sum and update queries on an array.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: FenwickTree,
  icon: 'bi-list-ol',
  features: [
    'Efficient prefix sum queries',
    'Supports point updates',
    'Space-efficient array-based implementation',
    'Ideal for cumulative frequency tables'
  ],
  timeComplexity: {
    access: 'O(log n)',
    search: 'O(log n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Prefix sum/range queries',
    'Inversion count in arrays',
    'Frequency tables',
    'Competitive programming'
  ]
},
  {
  id: 'segment-tree',
  name: 'Segment Tree',
  description: 'A binary tree data structure that allows fast range queries and updates over an array.',
  category: 'hierarchical',
  difficulty: 'advanced',
  component: SegmentTree, 
  icon: 'bi-diagram-2',
  features: [
    'Efficient range queries',
    'Supports range updates',
    'Binary tree structure',
    'Lazy propagation (optional)'
  ],
  timeComplexity: {
    access: 'O(log n)',
    search: 'O(log n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Range sum/min/max queries',
    'Interval problems',
    'Competitive programming',
    'Dynamic array problems'
  ]
},
  {
  id: 'disjoint-set',
  name: 'Disjoint Set (Union-Find)',
  description: 'A data structure that keeps track of a partition of a set into disjoint subsets, supporting efficient union and find operations.',
  category: 'non-linear',
  difficulty: 'intermediate',
  component: DisjointSet, 
  icon: 'bi-diagram-3',
  features: [
    'Efficient union and find',
    'Union by rank',
    'Path compression',
    'Dynamic connectivity'
  ],
  timeComplexity: {
    access: 'O(1)',
    search: 'O(α(n))', 
    insertion: 'O(1)',
    deletion: 'O(1)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Network connectivity',
    'Kruskal’s MST algorithm',
    'Image processing (connected components)',
    'Dynamic connectivity queries'
  ]
},
  {
  id: 'trie',
  name: 'Trie (Prefix Tree)',
  description: 'A tree-like data structure for storing strings, enabling fast prefix searches and dictionary operations.',
  category: 'hierarchical',
  difficulty: 'intermediate',
  component: Trie, 
  icon: 'bi-tree',
  features: [
    'Efficient prefix search',
    'Fast insert and lookup',
    'Space-efficient for large dictionaries',
    'Supports autocomplete'
  ],
  timeComplexity: {
    access: 'O(m)',
    search: 'O(m)',
    insertion: 'O(m)',
    deletion: 'O(m)'
  },
  spaceComplexity: 'O(n * m)', 
  useCases: [
    'Autocomplete',
    'Spell checking',
    'IP routing',
    'Dictionary implementations'
  ]
}
,
  {
  id: 'hash-table',
  name: 'Hash Table',
  description: 'A data structure that maps keys to values using a hash function, enabling fast access, insertion, and deletion.',
  category: 'linear',
  difficulty: 'intermediate',
  component: HashTable,
  icon: 'bi-hash',
  features: [
    'Key-value mapping',
    'Constant time average-case operations',
    'Handles collisions',
    'Efficient lookups and updates'
  ],
  timeComplexity: {
    access: 'O(1)',
    search: 'O(1)',
    insertion: 'O(1)',
    deletion: 'O(1)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Dictionaries and maps',
    'Caching (e.g., LRU)',
    'Symbol tables in compilers',
    'Database indexing'
  ]
},
  {
  id: 'backtracking',
  name: 'Backtracking',
  description: 'A recursive, depth-first technique for systematically searching all possible solutions to constraint satisfaction problems, such as N-Queens.',
  category: 'non-linear',
  difficulty: 'advanced',
  component: Backtracking,
  icon: 'bi-arrow-repeat',
  features: [
    'Recursive search',
    'Constraint satisfaction',
    'Systematic pruning',
    'Exponential solution space'
  ],
  timeComplexity: {
    access: 'Depends',
    search: 'Exponential',
    insertion: 'Depends',
    deletion: 'Depends'
  },
  spaceComplexity: 'O(N)',
  useCases: [
    'N-Queens problem',
    'Sudoku solving',
    'Maze/pathfinding',
    'Permutations/combinations',
    'Subset sum/partition'
  ]
},
  {
  id: 'heap',
  name: 'Heap (Binary Max Heap)',
  description: 'A complete binary tree where each parent node is greater than or equal to its children, supporting efficient priority queue operations.',
  category: 'non-linear',
  difficulty: 'intermediate',
  component: Heap,
  icon: 'bi-diagram-2',
  features: [
    'Complete binary tree',
    'Efficient insert and remove-max',
    'Priority queue structure',
    'Array-based implementation'
  ],
  timeComplexity: {
    access: 'O(1)',
    search: 'O(n)',
    insertion: 'O(log n)',
    deletion: 'O(log n)'
  },
  spaceComplexity: 'O(n)',
  useCases: [
    'Priority queues',
    'Heap sort',
    'Dijkstra/Prim’s algorithms',
    'Scheduling tasks'
  ]
},
  {
    id: 'arrays',
    name: 'Arrays',
    description: 'A collection of elements stored at contiguous memory locations.',
    category: 'linear',
    difficulty: 'beginner',
    component: Arrays,
    icon: 'bi-collection',
    features: [
      'Fixed or dynamic size',
      'Random access',
      'Contiguous memory',
      'Index-based access'
    ],
    timeComplexity: {
      access: 'O(1)',
      search: 'O(n)',
      insertion: 'O(n)',
      deletion: 'O(n)'
    },
    spaceComplexity: 'O(n)',
    useCases: [
      'Storing collections of data',
      'Matrix operations',
      'Buffer management',
      'Lookup tables'
    ]
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    description: 'A linear data structure where elements are stored in nodes with references to the next node.',
    category: 'linear',
    difficulty: 'beginner',
    component: LinkedList,
    icon: 'bi-link-45deg',
    features: [
      'Dynamic size',
      'Sequential access',  
      'Memory efficient',
      'Easy insertion/deletion'
    ],
    timeComplexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1)',
      deletion: 'O(1)'
    },
    spaceComplexity: 'O(n)',
    useCases: [
      'Implementing stacks and queues',
      'Memory management',
      'Undo functionality',
      'Polynomial arithmetic'
    ]
  },
  {
    id: 'stacks',
    name: 'Stacks',
    description: 'A linear data structure that follows LIFO (Last In First Out) principle.',
    category: 'linear',
    difficulty: 'beginner',
    component: Stack,
    icon: 'bi-stack',
    features: [
      'LIFO principle',
      'Push and pop operations',
      'Peek operation',
      'Dynamic size'
    ],
    timeComplexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1)',
      deletion: 'O(1)'
    },
    spaceComplexity: 'O(n)',
    useCases: [
      'Function call management',
      'Undo operations',
      'Expression evaluation',
      'Backtracking algorithms'
    ]
  },
  {
    id: 'queues',
    name: 'Queues',
    description: 'A linear data structure that follows FIFO (First In First Out) principle.',
    category: 'linear',
    difficulty: 'beginner',
    component: Queue,
    icon: 'bi-arrow-left-right',
    features: [
      'FIFO principle',
      'Enqueue and dequeue operations',
      'Front and rear pointers',
      'Circular implementation possible'
    ],
    timeComplexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1)',
      deletion: 'O(1)'
    },
    spaceComplexity: 'O(n)',
    useCases: [
      'Task scheduling',
      'Breadth-first search',
      'Print spooling',
      'CPU scheduling'
    ]
  },
  {
    id: 'trees',
    name: 'Trees',
    description: 'A hierarchical data structure with nodes connected by edges.',
    category: 'hierarchical',
    difficulty: 'intermediate',
    component: Tree,
    icon: 'bi-diagram-2',
    features: [
      'Hierarchical structure',
      'Parent-child relationships',
      'Multiple children per node',
      'Tree traversal algorithms'
    ],
    timeComplexity: {
      access: 'O(log n)',
      search: 'O(log n)',
      insertion: 'O(log n)',
      deletion: 'O(log n)'
    },
    spaceComplexity: 'O(n)',
    useCases: [
      'File systems',
      'Database indexing',
      'Expression trees',
      'Decision trees'
    ]
  },
  {
    id: 'graphs',
    name: 'Graphs',
    description: 'A non-linear data structure consisting of vertices and edges.',
    category: 'graph',
    difficulty: 'advanced',
    component: Graph,
    icon: 'bi-diagram-3',
    features: [
      'Vertices and edges',
      'Directed and undirected',
      'Weighted and unweighted',
      'Multiple traversal algorithms'
    ],
    timeComplexity: {
      access: 'O(V + E)',
      search: 'O(V + E)',
      insertion: 'O(1)',
      deletion: 'O(V + E)'
    },
    spaceComplexity: 'O(V + E)',
    useCases: [
      'Social networks',
      'Navigation systems',
      'Network routing',
      'Dependency resolution'
    ]
  },
];
