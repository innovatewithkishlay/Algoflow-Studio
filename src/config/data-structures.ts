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
