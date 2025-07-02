import Arrays from '../pages/data-structures/Arrays';
import LinkedList from '../pages/data-structures/LinkedList';
import Stack from '../pages/data-structures/Stack';
import Queue from '../pages/data-structures/Queue';
import Tree from '../pages/data-structures/Tree';
import Graph from '../pages/data-structures/Graph';

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
  {
    id: 'coming-soon',
    name: 'More Data Structures Coming Soon',
    description: 'We are working on adding more data structures to help you learn and visualize complex concepts.',
    category: 'linear',
    difficulty: 'beginner',
    component: null,
    icon: 'bi-hourglass-split',
    features: [
      'Hash Tables',
      'Heaps',
      'Tries',
      'Advanced Trees'
    ],
    timeComplexity: {
      access: 'TBD',
      search: 'TBD',
      insertion: 'TBD',
      deletion: 'TBD'
    },
    spaceComplexity: 'TBD',
    useCases: [
      'Advanced data structures',
      'Specialized use cases',
      'Performance optimization',
      'Real-world applications'
    ]
  }
];
