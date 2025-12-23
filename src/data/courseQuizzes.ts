import { CourseQuizData } from "@/components/CourseQuiz";

export const courseQuizzes: CourseQuizData[] = [
  {
    courseId: "anxiety",
    title: "Understanding Anxiety Quiz",
    questions: [
      {
        id: "anx-1",
        question: "What is anxiety primarily characterized by?",
        options: [
          "A constant feeling of happiness",
          "Persistent worry and fear about everyday situations",
          "Complete absence of emotions",
          "Only physical symptoms without mental effects"
        ],
        correctAnswer: 1,
        explanation: "Anxiety is characterized by persistent worry and fear about everyday situations, often accompanied by physical symptoms like increased heart rate and tension."
      },
      {
        id: "anx-2",
        question: "Which breathing technique is commonly used to reduce anxiety?",
        options: [
          "Breathing as fast as possible",
          "Holding your breath for long periods",
          "Deep, slow diaphragmatic breathing",
          "Shallow chest breathing"
        ],
        correctAnswer: 2,
        explanation: "Deep, slow diaphragmatic breathing activates the parasympathetic nervous system, which helps calm the body's stress response."
      },
      {
        id: "anx-3",
        question: "What is cognitive restructuring?",
        options: [
          "A type of brain surgery",
          "Rearranging furniture to reduce stress",
          "Identifying and challenging negative thought patterns",
          "Memorizing positive affirmations"
        ],
        correctAnswer: 2,
        explanation: "Cognitive restructuring is a CBT technique that involves identifying, challenging, and changing unhelpful thought patterns that contribute to anxiety."
      },
      {
        id: "anx-4",
        question: "Which of these is a common physical symptom of anxiety?",
        options: [
          "Decreased heart rate",
          "Muscle relaxation",
          "Increased appetite always",
          "Rapid heartbeat and muscle tension"
        ],
        correctAnswer: 3,
        explanation: "Anxiety often manifests physically with symptoms like rapid heartbeat, muscle tension, sweating, and shortness of breath as part of the body's fight-or-flight response."
      },
      {
        id: "anx-5",
        question: "What is an anxiety trigger?",
        options: [
          "A button that stops anxiety instantly",
          "A situation, thought, or event that causes anxiety to increase",
          "A medication for anxiety",
          "A type of therapy"
        ],
        correctAnswer: 1,
        explanation: "An anxiety trigger is any situation, thought, memory, or event that causes an increase in anxiety symptoms. Identifying triggers is key to managing anxiety."
      }
    ]
  },
  {
    courseId: "depression",
    title: "Overcoming Depression Quiz",
    questions: [
      {
        id: "dep-1",
        question: "How does depression differ from normal sadness?",
        options: [
          "Depression only lasts a few hours",
          "Depression is persistent, lasting weeks or more, and affects daily functioning",
          "They are exactly the same thing",
          "Sadness is more severe than depression"
        ],
        correctAnswer: 1,
        explanation: "Unlike normal sadness, depression is persistent (lasting two weeks or more), affects multiple areas of life, and significantly impairs daily functioning."
      },
      {
        id: "dep-2",
        question: "What is behavioral activation?",
        options: [
          "A type of medication",
          "Waiting for motivation before doing activities",
          "Engaging in meaningful activities even when not feeling motivated",
          "Avoiding all activities until feeling better"
        ],
        correctAnswer: 2,
        explanation: "Behavioral activation involves scheduling and engaging in meaningful activities even when not feeling motivated, which can help break the cycle of depression."
      },
      {
        id: "dep-3",
        question: "How does physical health impact depression?",
        options: [
          "Physical health has no connection to mental health",
          "Exercise, sleep, and nutrition significantly affect mood and depression",
          "Only medication can affect depression",
          "Physical activity makes depression worse"
        ],
        correctAnswer: 1,
        explanation: "Physical health significantly impacts depression. Regular exercise, adequate sleep, and proper nutrition can help improve mood and reduce depressive symptoms."
      },
      {
        id: "dep-4",
        question: "What are negative automatic thoughts?",
        options: [
          "Thoughts that are always true",
          "Positive self-talk",
          "Involuntary negative thoughts that pop up and affect mood",
          "Thoughts that only occur during sleep"
        ],
        correctAnswer: 2,
        explanation: "Negative automatic thoughts are involuntary, often distorted thoughts that pop up quickly and can worsen depressive symptoms. Learning to identify and challenge them is a key part of CBT."
      },
      {
        id: "dep-5",
        question: "Why is social connection important in depression recovery?",
        options: [
          "It isn't important at all",
          "Social isolation improves depression",
          "Connection reduces isolation, provides support, and improves mood",
          "Only professional help matters"
        ],
        correctAnswer: 2,
        explanation: "Social connection is crucial because isolation often worsens depression. Connecting with others provides emotional support, reduces loneliness, and can improve overall well-being."
      }
    ]
  },
  {
    courseId: "stress",
    title: "Stress Management Quiz",
    questions: [
      {
        id: "str-1",
        question: "What happens to the body during the stress response?",
        options: [
          "The body becomes completely relaxed",
          "Cortisol and adrenaline are released, increasing heart rate and alertness",
          "Blood pressure decreases significantly",
          "The digestive system speeds up"
        ],
        correctAnswer: 1,
        explanation: "During stress, the body releases cortisol and adrenaline, which increase heart rate, blood pressure, and alertness as part of the 'fight or flight' response."
      },
      {
        id: "str-2",
        question: "What is an effective time management strategy for reducing stress?",
        options: [
          "Doing everything at the last minute",
          "Never saying no to requests",
          "Prioritizing tasks and breaking them into smaller steps",
          "Multitasking on everything simultaneously"
        ],
        correctAnswer: 2,
        explanation: "Prioritizing tasks and breaking them into manageable steps helps prevent overwhelm and makes large tasks feel more achievable, reducing stress."
      },
      {
        id: "str-3",
        question: "What is progressive muscle relaxation?",
        options: [
          "Exercising until exhausted",
          "Tensing and then releasing muscle groups to reduce physical tension",
          "Avoiding all physical activity",
          "A type of massage therapy"
        ],
        correctAnswer: 1,
        explanation: "Progressive muscle relaxation involves systematically tensing and then releasing different muscle groups, which helps reduce physical tension and promotes relaxation."
      },
      {
        id: "str-4",
        question: "Why is setting boundaries important for stress management?",
        options: [
          "Boundaries aren't related to stress",
          "It helps protect your time and energy from being overextended",
          "You should always say yes to everything",
          "Boundaries make stress worse"
        ],
        correctAnswer: 1,
        explanation: "Setting healthy boundaries protects your time and energy, prevents burnout, and helps maintain a sustainable balance between responsibilities and self-care."
      }
    ]
  },
  {
    courseId: "anger",
    title: "Anger Management Quiz",
    questions: [
      {
        id: "ang-1",
        question: "Is anger a normal emotion?",
        options: [
          "No, anger should never be felt",
          "Yes, but it's how we express it that matters",
          "Only some people feel anger",
          "Anger is always harmful"
        ],
        correctAnswer: 1,
        explanation: "Anger is a normal, healthy emotion. The key is learning to express and manage it in healthy ways that don't harm yourself or others."
      },
      {
        id: "ang-2",
        question: "What are early warning signs of anger?",
        options: [
          "Feeling calm and relaxed",
          "Decreased heart rate",
          "Physical tension, clenched fists, increased heart rate, racing thoughts",
          "Improved concentration"
        ],
        correctAnswer: 2,
        explanation: "Early warning signs of anger include physical changes like muscle tension, clenched fists, increased heart rate, and mental changes like racing or hostile thoughts."
      },
      {
        id: "ang-3",
        question: "What is an effective 'cooling down' strategy when angry?",
        options: [
          "Immediately confronting the person who upset you",
          "Suppressing all emotions",
          "Taking a timeout to breathe and calm down before responding",
          "Breaking objects to release tension"
        ],
        correctAnswer: 2,
        explanation: "Taking a timeout allows you to calm down physiologically and think more clearly before responding, leading to more constructive outcomes."
      },
      {
        id: "ang-4",
        question: "What is assertive communication?",
        options: [
          "Yelling to make your point",
          "Staying silent to avoid conflict",
          "Expressing your needs clearly and respectfully without aggression",
          "Agreeing with everything others say"
        ],
        correctAnswer: 2,
        explanation: "Assertive communication means expressing your thoughts, feelings, and needs clearly and respectfully, without being passive or aggressive."
      },
      {
        id: "ang-5",
        question: "How can you prevent anger from building up over time?",
        options: [
          "Ignore all frustrations until they explode",
          "Address issues early, practice regular stress relief, and communicate openly",
          "Avoid all potentially frustrating situations",
          "Keep all feelings to yourself"
        ],
        correctAnswer: 1,
        explanation: "Preventing chronic anger involves addressing issues when they're small, practicing regular stress management, and maintaining open communication about your needs."
      }
    ]
  },
  {
    courseId: "sleep",
    title: "Better Sleep Habits Quiz",
    questions: [
      {
        id: "slp-1",
        question: "What is sleep hygiene?",
        options: [
          "Showering before bed",
          "Habits and practices that promote consistent, quality sleep",
          "Cleaning your bedroom daily",
          "Using special pillows"
        ],
        correctAnswer: 1,
        explanation: "Sleep hygiene refers to the habits, behaviors, and environmental factors that promote consistent, quality sleep."
      },
      {
        id: "slp-2",
        question: "How does screen time affect sleep?",
        options: [
          "Blue light from screens has no effect on sleep",
          "Blue light suppresses melatonin, making it harder to fall asleep",
          "Screens always improve sleep quality",
          "Only TV screens affect sleep"
        ],
        correctAnswer: 1,
        explanation: "Blue light from electronic screens suppresses the production of melatonin, the hormone that regulates sleep, making it harder to fall asleep."
      },
      {
        id: "slp-3",
        question: "What is an effective wind-down routine?",
        options: [
          "Vigorous exercise right before bed",
          "Drinking coffee to relax",
          "Calming activities like reading, gentle stretching, or meditation",
          "Checking work emails"
        ],
        correctAnswer: 2,
        explanation: "An effective wind-down routine includes calming activities that signal to your body it's time for sleep, such as reading, gentle stretching, or meditation."
      },
      {
        id: "slp-4",
        question: "What bedroom conditions are best for sleep?",
        options: [
          "Warm, bright, and noisy",
          "Cool, dark, and quiet",
          "Very cold and completely silent",
          "Bright with TV on for background noise"
        ],
        correctAnswer: 1,
        explanation: "Optimal sleep conditions include a cool temperature (around 65-68°F), darkness to promote melatonin production, and minimal noise disruption."
      }
    ]
  },
  {
    courseId: "self-esteem",
    title: "Building Self-Esteem Quiz",
    questions: [
      {
        id: "est-1",
        question: "What is self-esteem?",
        options: [
          "Thinking you're better than everyone else",
          "Your overall sense of personal value and self-worth",
          "Never having any negative thoughts",
          "Being perfect at everything"
        ],
        correctAnswer: 1,
        explanation: "Self-esteem is your overall subjective sense of personal worth or value. It's how much you appreciate and like yourself regardless of circumstances."
      },
      {
        id: "est-2",
        question: "What is the 'inner critic'?",
        options: [
          "A helpful voice that always gives good advice",
          "The negative self-talk that judges and criticizes you harshly",
          "Your conscience",
          "Feedback from others"
        ],
        correctAnswer: 1,
        explanation: "The inner critic is the internal voice of negative self-talk that judges, criticizes, and often holds us to impossible standards."
      },
      {
        id: "est-3",
        question: "How can you build self-esteem through goal-setting?",
        options: [
          "Set impossible goals to challenge yourself",
          "Avoid all goals to prevent failure",
          "Set achievable goals and celebrate small wins",
          "Only focus on what you can't do"
        ],
        correctAnswer: 2,
        explanation: "Setting achievable goals and celebrating small wins builds self-efficacy and confidence, gradually strengthening self-esteem over time."
      },
      {
        id: "est-4",
        question: "What is self-compassion?",
        options: [
          "Making excuses for bad behavior",
          "Being lazy and unproductive",
          "Treating yourself with the same kindness you'd offer a good friend",
          "Ignoring all your flaws"
        ],
        correctAnswer: 2,
        explanation: "Self-compassion means treating yourself with the same kindness, care, and understanding that you would offer to a good friend, especially during difficult times."
      },
      {
        id: "est-5",
        question: "Why is recognizing your strengths important for self-esteem?",
        options: [
          "It makes you arrogant",
          "It's not important at all",
          "It provides a realistic, balanced view of yourself and builds confidence",
          "You should only focus on weaknesses"
        ],
        correctAnswer: 2,
        explanation: "Recognizing strengths provides a balanced self-view, counters the negativity bias of low self-esteem, and builds genuine confidence."
      }
    ]
  },
  {
    courseId: "relationships",
    title: "Healthy Relationships Quiz",
    questions: [
      {
        id: "rel-1",
        question: "What is active listening?",
        options: [
          "Waiting for your turn to speak",
          "Fully focusing on the speaker and seeking to understand their message",
          "Giving advice immediately",
          "Multitasking while someone talks"
        ],
        correctAnswer: 1,
        explanation: "Active listening means fully concentrating on what someone is saying, understanding their message, and responding thoughtfully."
      },
      {
        id: "rel-2",
        question: "What are attachment styles?",
        options: [
          "How physically close you sit to others",
          "Patterns of relating to others formed from early experiences",
          "How attached you are to material things",
          "Preference for certain activities"
        ],
        correctAnswer: 1,
        explanation: "Attachment styles are patterns of relating to others that develop based on early life experiences with caregivers and influence adult relationships."
      },
      {
        id: "rel-3",
        question: "What is a healthy approach to conflict in relationships?",
        options: [
          "Avoid all disagreements at any cost",
          "Win every argument",
          "Address issues calmly, listen to understand, and seek solutions together",
          "Give the silent treatment"
        ],
        correctAnswer: 2,
        explanation: "Healthy conflict resolution involves addressing issues calmly, listening to understand (not just to respond), and working together to find solutions."
      },
      {
        id: "rel-4",
        question: "What builds trust in relationships?",
        options: [
          "Keeping secrets",
          "Consistency, honesty, and following through on commitments",
          "Never disagreeing",
          "Constantly checking on your partner"
        ],
        correctAnswer: 1,
        explanation: "Trust is built through consistency, honesty, reliability, and following through on commitments over time."
      }
    ]
  },
  {
    courseId: "mindfulness",
    title: "Mindfulness Essentials Quiz",
    questions: [
      {
        id: "mnd-1",
        question: "What is mindfulness?",
        options: [
          "Thinking about the past",
          "Planning for the future",
          "Paying attention to the present moment without judgment",
          "Emptying your mind completely"
        ],
        correctAnswer: 2,
        explanation: "Mindfulness is the practice of paying attention to the present moment intentionally and without judgment."
      },
      {
        id: "mnd-2",
        question: "What is the purpose of focusing on breath in meditation?",
        options: [
          "To hyperventilate",
          "It serves as an anchor to the present moment",
          "To hold your breath as long as possible",
          "To breathe as fast as possible"
        ],
        correctAnswer: 1,
        explanation: "The breath serves as an anchor to the present moment. When your mind wanders, you can always return attention to the breath."
      },
      {
        id: "mnd-3",
        question: "What is a body scan meditation?",
        options: [
          "Getting an MRI",
          "Systematically bringing awareness to different parts of the body",
          "Checking for physical injuries",
          "Exercising different muscle groups"
        ],
        correctAnswer: 1,
        explanation: "A body scan meditation involves systematically bringing awareness to different parts of the body, noticing sensations without trying to change them."
      },
      {
        id: "mnd-4",
        question: "How can you practice mindfulness in daily life?",
        options: [
          "Only during formal meditation sessions",
          "By bringing full attention to everyday activities like eating or walking",
          "By multitasking as much as possible",
          "By thinking about multiple things at once"
        ],
        correctAnswer: 1,
        explanation: "Mindfulness can be practiced during any daily activity by bringing full, non-judgmental attention to what you're doing in the present moment."
      },
      {
        id: "mnd-5",
        question: "What should you do when your mind wanders during meditation?",
        options: [
          "Get frustrated and give up",
          "Force yourself to stop thinking",
          "Gently notice the wandering and return attention to your focus point",
          "Meditation isn't working if your mind wanders"
        ],
        correctAnswer: 2,
        explanation: "Mind wandering is normal and expected. The practice is to gently notice when it happens and kindly redirect attention back to your focus point."
      }
    ]
  }
];
