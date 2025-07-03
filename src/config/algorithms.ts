import LinearSearch from '../pages/algorithms/LinearSearch';
import BinarySearch from '../pages/algorithms/BinarySearch';
import BubbleSort from '../pages/algorithms/BubbleSort';
import MergeSort from '../pages/algorithms/MergeSort';
import QuickSort from '../pages/algorithms/QuickSort';
import BFS from '../pages/algorithms/BFS';
import DFS from '../pages/algorithms/DFS';
import InsertionSort from '../pages/algorithms/InsertionSort';
import SelectionSort from '../pages/algorithms/SelectionSort';
import HeapSort from '../pages/algorithms/HeapSort';
import CountingSort from '../pages/algorithms/CountingSort';
export interface Algorithm {
  id: string;
  name: string;
  description: string;
  category: 'searching' | 'sorting' | 'graph' | 'dynamic-programming' | 'greedy';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  component: React.ComponentType | null;
  icon: string;
  features: string[];
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  useCases: string[];
  advantages: string[];
  disadvantages: string[];
}

export const algorithms: Algorithm[] = [
  {
    id: 'linear-search',
    name: 'Linear Search',
    description: 'A simple searching algorithm that checks each element in the array sequentially.',
    category: 'searching',
    difficulty: 'beginner',
    component: LinearSearch,
    icon: 'bi-search',
    features: [
      'Sequential search',
      'Works on unsorted data',
      'Simple implementation',
      'Guaranteed to find element if present'
    ],
    timeComplexity: {
      best: 'O(1)',
      average: 'O(n/2)',
      worst: 'O(n)'
    },
    spaceComplexity: 'O(1)',
    useCases: [
      'Small datasets',
      'Unsorted data',
      'Simple applications',
      'Educational purposes'
    ],
    advantages: [
      'Simple to implement',
      'Works on any data structure',
      'No preprocessing required',
      'Guaranteed to find element'
    ],
    disadvantages: [
      'Inefficient for large datasets',
      'O(n) time complexity',
      'Not suitable for sorted data'
    ]
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    description: 'An efficient searching algorithm that works on sorted arrays by repeatedly dividing the search interval in half.',
    category: 'searching',
    difficulty: 'intermediate',
    component: BinarySearch,
    icon: 'bi-search',
    features: [
      'Divide and conquer',
      'Requires sorted data',
      'Logarithmic time complexity',
      'Efficient for large datasets'
    ],
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)'
    },
    spaceComplexity: 'O(1)',
    useCases: [
      'Large sorted datasets',
      'Database queries',
      'Game development',
      'Scientific computing'
    ],
    advantages: [
      'Very efficient',
      'O(log n) time complexity',
      'Works well with large datasets',
      'Predictable performance'
    ],
    disadvantages: [
      'Requires sorted data',
      'More complex implementation',
      'Not suitable for unsorted data'
    ]
  },
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    category: 'sorting',
    difficulty: 'beginner',
    component: BubbleSort,
    icon: 'bi-arrow-repeat',
    features: [
      'In-place sorting',
      'Stable sort',
      'Simple implementation',
      'Adaptive algorithm'
    ],
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(1)',
    useCases: [
      'Educational purposes',
      'Small datasets',
      'Nearly sorted data',
      'Simple applications'
    ],
    advantages: [
      'Simple to understand',
      'In-place sorting',
      'Stable sort',
      'Adaptive for nearly sorted data'
    ],
    disadvantages: [
      'Poor performance on large datasets',
      'O(n²) time complexity',
      'Many swaps required'
    ]
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    description: 'A divide-and-conquer sorting algorithm that recursively divides the array into two halves, sorts them, and then merges them.',
    category: 'sorting',
    difficulty: 'intermediate',
    component: MergeSort,
    icon: 'bi-arrow-left-right',
    features: [
      'Divide and conquer',
      'Stable sort',
      'Predictable performance',
      'External sorting capable'
    ],
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)'
    },
    spaceComplexity: 'O(n)',
    useCases: [
      'Large datasets',
      'External sorting',
      'Linked list sorting',
      'Stable sorting required'
    ],
    advantages: [
      'Consistent O(n log n) performance',
      'Stable sort',
      'Predictable behavior',
      'Good for large datasets'
    ],
    disadvantages: [
      'Requires extra space',
      'Not in-place',
      'Overkill for small datasets'
    ]
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    description: 'A highly efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy with a pivot element.',
    category: 'sorting',
    difficulty: 'intermediate',
    component: QuickSort,
    icon: 'bi-lightning',
    features: [
      'Divide and conquer',
      'In-place sorting',
      'Pivot-based partitioning',
      'Cache-friendly'
    ],
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)'
    },
    spaceComplexity: 'O(log n)',
    useCases: [
      'General-purpose sorting',
      'Large datasets',
      'Cache-optimized systems',
      'Real-time applications'
    ],
    advantages: [
      'Excellent average performance',
      'In-place sorting',
      'Cache-friendly',
      'Widely used in practice'
    ],
    disadvantages: [
      'Unstable sort',
      'Poor performance on sorted data',
      'Complex implementation',
      'Worst case O(n²)'
    ]
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
    category: 'graph',
    difficulty: 'intermediate',
    component: DFS,
    icon: 'bi-arrow-down-right',
    features: [
      'Graph traversal',
      'Recursive or iterative',
      'Backtracking',
      'Memory efficient'
    ],
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    spaceComplexity: 'O(V)',
    useCases: [
      'Maze solving',
      'Topological sorting',
      'Cycle detection',
      'Connected components'
    ],
    advantages: [
      'Memory efficient',
      'Simple implementation',
      'Good for deep graphs',
      'Natural backtracking'
    ],
    disadvantages: [
      'May not find shortest path',
      'Can get stuck in deep paths',
      'Not optimal for wide graphs'
    ]
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    description: 'A graph traversal algorithm that explores all vertices at the present depth before moving to vertices at the next depth level.',
    category: 'graph',
    difficulty: 'intermediate',
    component: BFS,
    icon: 'bi-arrow-right',
    features: [
      'Level-by-level traversal',
      'Queue-based',
      'Shortest path finding',
      'Complete exploration'
    ],
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)'
    },
    spaceComplexity: 'O(V)',
    useCases: [
      'Shortest path finding',
      'Web crawling',
      'Social network analysis',
      'GPS navigation'
    ],
    advantages: [
      'Finds shortest path',
      'Complete exploration',
      'Good for wide graphs',
      'Predictable behavior'
    ],
    disadvantages: [
      'Memory intensive',
      'Not optimal for deep graphs',
      'May explore unnecessary nodes'
    ]
  },
  {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  description: 'A simple, intuitive sorting algorithm that builds the sorted array one element at a time.',
  category: 'sorting',
  difficulty: 'beginner',
  component: InsertionSort,
  icon: 'bi-arrow-down',
  features: [
    'In-place sorting',
    'Stable sort',
    'Adaptive for nearly sorted data',
    'Simple implementation'
  ],
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  useCases: [
    'Small datasets',
    'Nearly sorted data',
    'Real-time applications'
  ],
  advantages: [
    'Simple and intuitive',
    'Stable and in-place',
    'Efficient for small/mostly sorted data'
  ],
  disadvantages: [
    'Inefficient for large datasets',
    'O(n²) time complexity'
  ]
},

{
  id: 'selection-sort',
  name: 'Selection Sort',
  description: 'A simple, comparison-based sorting algorithm that repeatedly selects the minimum element from the unsorted part and puts it at the beginning.',
  category: 'sorting',
  difficulty: 'beginner',
  component: SelectionSort,
  icon: 'bi-arrow-down-up',
  features: [
    'In-place sorting',
    'Simple implementation',
    'Always O(n²) comparisons',
    'Not stable'
  ],
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  useCases: [
    'Small datasets',
    'Educational purposes',
    'When memory writes are expensive'
  ],
  advantages: [
    'Simple to implement',
    'In-place sorting',
    'Fewer swaps than bubble sort'
  ],
  disadvantages: [
    'Inefficient for large datasets',
    'Not stable',
    'O(n²) time complexity'
  ]
},

{
  id: 'heap-sort',
  name: 'Heap Sort',
  description: 'An efficient, comparison-based sorting algorithm that uses a binary heap data structure to sort elements.',
  category: 'sorting',
  difficulty: 'intermediate',
  component: HeapSort,
  icon: 'bi-diagram-3',
  features: [
    'In-place sorting',
    'Consistent O(n log n) time',
    'Uses binary heap',
    'Not stable'
  ],
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)'
  },
  spaceComplexity: 'O(1)',
  useCases: [
    'Large datasets',
    'Memory-constrained systems',
    'Real-time applications'
  ],
  advantages: [
    'Consistent performance',
    'In-place sorting',
    'Good for large datasets'
  ],
  disadvantages: [
    'Not stable',
    'More complex than simple sorts',
    'Poor locality of reference'
  ]
},{
  id: 'counting-sort',
  name: 'Counting Sort',
  description: 'A non-comparison-based sorting algorithm that sorts integers by counting the number of occurrences of each unique value.',
  category: 'sorting',
  difficulty: 'intermediate',
  component: CountingSort,
  icon: 'bi-bar-chart',
  features: [
    'Non-comparison-based',
    'Stable sort',
    'Efficient for small integer ranges',
    'O(n + k) time'
  ],
  timeComplexity: {
    best: 'O(n + k)',
    average: 'O(n + k)',
    worst: 'O(n + k)'
  },
  spaceComplexity: 'O(k)',
  useCases: [
    'Sorting small integer arrays',
    'Counting frequencies',
    'Radix sort subroutine'
  ],
  advantages: [
    'Very fast for small ranges',
    'Stable sort',
    'Simple to implement'
  ],
  disadvantages: [
    'Not suitable for large ranges',
    'Not comparison-based',
    'Uses extra space'
  ]
},
  {
    id: 'coming-soon',
    name: 'More Algorithms Coming Soon',
    description: 'We are working on adding more algorithms to help you learn and visualize complex computational concepts.',
    category: 'sorting',
    difficulty: 'beginner',
    component: null,
    icon: 'bi-hourglass-split',
    features: [
      'Dynamic Programming',
      'Greedy Algorithms',
      'Advanced Sorting',
      'Graph Algorithms'
    ],
    timeComplexity: {
      best: 'TBD',
      average: 'TBD',
      worst: 'TBD'
    },
    spaceComplexity: 'TBD',
    useCases: [
      'Advanced algorithms',
      'Optimization problems',
      'Complex data processing',
      'Real-world applications'
    ],
    advantages: [
      'Advanced problem solving',
      'Optimization techniques',
      'Efficient solutions',
      'Industry applications'
    ],
    disadvantages: [
      'Complex implementation',
      'Requires deep understanding',
      'May be overkill for simple problems'
    ]
  }
];
