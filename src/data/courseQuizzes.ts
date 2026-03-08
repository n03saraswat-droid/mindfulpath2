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
  },
  {
    courseId: "social-anxiety",
    title: "Social Anxiety Quiz",
    questions: [
      {
        id: "soc-1",
        question: "What is social anxiety disorder?",
        options: [
          "Being shy occasionally",
          "Intense fear of being judged or embarrassed in social situations",
          "Disliking all people",
          "Being introverted"
        ],
        correctAnswer: 1,
        explanation: "Social anxiety disorder involves intense, persistent fear of being watched, judged, or embarrassed in social situations, going beyond normal shyness."
      },
      {
        id: "soc-2",
        question: "What cognitive distortion is common in social anxiety?",
        options: [
          "Optimism bias",
          "Mind reading — assuming others are thinking negatively about you",
          "Always seeing the bright side",
          "Ignoring social cues"
        ],
        correctAnswer: 1,
        explanation: "Mind reading is a common cognitive distortion where you assume you know what others are thinking, usually assuming it's negative."
      },
      {
        id: "soc-3",
        question: "What is exposure therapy for social anxiety?",
        options: [
          "Avoiding all feared situations permanently",
          "Gradually and repeatedly facing feared social situations in a safe way",
          "Forcing yourself into the most terrifying situation immediately",
          "Only talking about fears without acting"
        ],
        correctAnswer: 1,
        explanation: "Exposure therapy involves gradually and systematically facing feared social situations, starting with less anxiety-provoking ones and building up."
      },
      {
        id: "soc-4",
        question: "Which safety behavior can maintain social anxiety?",
        options: [
          "Making eye contact",
          "Speaking clearly",
          "Avoiding speaking up, rehearsing every word, or staying near exits",
          "Being yourself"
        ],
        correctAnswer: 2,
        explanation: "Safety behaviors like avoiding participation, over-rehearsing, or positioning near exits provide short-term relief but maintain anxiety long-term by preventing learning."
      },
      {
        id: "soc-5",
        question: "How does self-focused attention affect social anxiety?",
        options: [
          "It reduces anxiety",
          "It has no effect",
          "It increases anxiety by making you hyper-aware of your own perceived flaws",
          "It helps you perform better socially"
        ],
        correctAnswer: 2,
        explanation: "Excessive self-focused attention increases social anxiety by making you overly aware of your own sensations and perceived shortcomings rather than engaging with others."
      }
    ]
  },
  {
    courseId: "trauma",
    title: "Trauma & Healing Quiz",
    questions: [
      {
        id: "trm-1",
        question: "What is a trauma response?",
        options: [
          "Choosing to be dramatic",
          "The body and mind's automatic reaction to a threatening or overwhelming event",
          "A sign of weakness",
          "Something only soldiers experience"
        ],
        correctAnswer: 1,
        explanation: "A trauma response is the body and mind's automatic, protective reaction to a threatening or overwhelming event. It is not a choice or a sign of weakness."
      },
      {
        id: "trm-2",
        question: "What does 'The Body Keeps the Score' mean?",
        options: [
          "You should exercise more",
          "Trauma is stored in the body and manifests as physical symptoms",
          "Your body counts how many bad things happen",
          "Physical health is unrelated to mental health"
        ],
        correctAnswer: 1,
        explanation: "This concept means that trauma is not just a psychological experience — it gets stored in the body and can manifest as physical symptoms, tension, and pain."
      },
      {
        id: "trm-3",
        question: "What is a grounding technique?",
        options: [
          "Standing barefoot on the ground",
          "A strategy that uses the senses to bring you back to the present moment",
          "Lying flat on the floor",
          "Gardening"
        ],
        correctAnswer: 1,
        explanation: "Grounding techniques use sensory awareness (like the 5-4-3-2-1 method) to anchor you in the present moment when triggered by trauma memories."
      },
      {
        id: "trm-4",
        question: "What is a trauma trigger?",
        options: [
          "The original traumatic event",
          "A stimulus that reminds you of the trauma and activates a stress response",
          "A type of gun",
          "Something that only affects you if you let it"
        ],
        correctAnswer: 1,
        explanation: "A trauma trigger is any sensory input (sound, smell, sight, etc.) that reminds the brain of the traumatic event and activates the body's stress response."
      },
      {
        id: "trm-5",
        question: "Why is safety important in trauma recovery?",
        options: [
          "It's not important",
          "Because establishing physical and emotional safety is the foundation for healing",
          "Only physical safety matters",
          "Safety prevents all triggers"
        ],
        correctAnswer: 1,
        explanation: "Establishing safety — both physical and emotional — is the critical first stage of trauma recovery, as healing cannot occur when someone still feels threatened."
      }
    ]
  },
  {
    courseId: "panic",
    title: "Panic Attack Recovery Quiz",
    questions: [
      {
        id: "pan-1",
        question: "What is a panic attack?",
        options: [
          "A heart attack",
          "A sudden episode of intense fear with physical symptoms like racing heart and shortness of breath",
          "Being slightly nervous",
          "A permanent condition"
        ],
        correctAnswer: 1,
        explanation: "A panic attack is a sudden surge of intense fear or discomfort that peaks within minutes, accompanied by physical symptoms like racing heart, sweating, and shortness of breath."
      },
      {
        id: "pan-2",
        question: "What is the 5-4-3-2-1 grounding technique?",
        options: [
          "Counting backwards from 5",
          "Identifying 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste",
          "Taking 5 deep breaths",
          "A type of exercise"
        ],
        correctAnswer: 1,
        explanation: "The 5-4-3-2-1 technique engages all five senses to anchor you in the present moment, helping interrupt the panic cycle."
      },
      {
        id: "pan-3",
        question: "Can a panic attack cause actual physical harm?",
        options: [
          "Yes, they can be fatal",
          "No, while extremely uncomfortable, panic attacks are not physically dangerous",
          "Only if they last more than an hour",
          "They always lead to fainting"
        ],
        correctAnswer: 1,
        explanation: "While panic attacks feel terrifying and produce real physical symptoms, they are not physically dangerous and will pass on their own."
      },
      {
        id: "pan-4",
        question: "What is 'fear of fear' in panic disorder?",
        options: [
          "Being afraid of horror movies",
          "The anxiety about having another panic attack, which can trigger more attacks",
          "A rare phobia",
          "Something that goes away on its own"
        ],
        correctAnswer: 1,
        explanation: "Fear of fear (anticipatory anxiety) is the dread of having another panic attack, which creates a cycle where anxiety about panicking can itself trigger panic attacks."
      },
      {
        id: "pan-5",
        question: "What breathing technique helps during a panic attack?",
        options: [
          "Breathing as fast as possible",
          "Holding your breath",
          "Slow, controlled breathing — inhale 4 counts, hold 4, exhale 6",
          "Breathing into a paper bag always works"
        ],
        correctAnswer: 2,
        explanation: "Slow, controlled breathing (like box breathing or extended exhale) activates the parasympathetic nervous system, counteracting the panic response."
      }
    ]
  },
  {
    courseId: "ocd",
    title: "Understanding OCD Quiz",
    questions: [
      {
        id: "ocd-1",
        question: "What does OCD stand for?",
        options: [
          "Obsessive Cleaning Disorder",
          "Obsessive-Compulsive Disorder",
          "Over-Cautious Disorder",
          "Occasional Checking Disorder"
        ],
        correctAnswer: 1,
        explanation: "OCD stands for Obsessive-Compulsive Disorder, characterized by unwanted, intrusive thoughts (obsessions) and repetitive behaviors (compulsions)."
      },
      {
        id: "ocd-2",
        question: "What is the difference between obsessions and compulsions?",
        options: [
          "They are the same thing",
          "Obsessions are unwanted thoughts; compulsions are behaviors performed to reduce the anxiety",
          "Obsessions are behaviors; compulsions are thoughts",
          "Only one of them is part of OCD"
        ],
        correctAnswer: 1,
        explanation: "Obsessions are unwanted, intrusive thoughts or urges that cause distress. Compulsions are repetitive behaviors or mental acts performed to reduce the anxiety caused by obsessions."
      },
      {
        id: "ocd-3",
        question: "What is ERP therapy?",
        options: [
          "Emergency Response Protocol",
          "Exposure and Response Prevention — facing fears without performing compulsions",
          "Emotional Reprocessing Plan",
          "A type of medication"
        ],
        correctAnswer: 1,
        explanation: "ERP (Exposure and Response Prevention) is the gold-standard treatment for OCD, involving gradual exposure to anxiety triggers while resisting compulsive behaviors."
      },
      {
        id: "ocd-4",
        question: "Is OCD just about being neat and organized?",
        options: [
          "Yes, OCD is just being very tidy",
          "No, OCD involves distressing intrusive thoughts and can manifest in many ways",
          "OCD only involves hand-washing",
          "OCD is a personality trait, not a disorder"
        ],
        correctAnswer: 1,
        explanation: "OCD is far more than tidiness. It involves distressing, unwanted thoughts and can manifest as fears about harm, contamination, symmetry, religious/moral concerns, and many other themes."
      },
      {
        id: "ocd-5",
        question: "Why do compulsions make OCD worse over time?",
        options: [
          "They don't — compulsions cure OCD",
          "They provide temporary relief but reinforce the cycle of obsession and anxiety",
          "Compulsions have no effect",
          "They only make it worse if done incorrectly"
        ],
        correctAnswer: 1,
        explanation: "Compulsions provide temporary relief but reinforce the brain's belief that the obsession was a real threat, strengthening the OCD cycle over time."
      }
    ]
  },
  {
    courseId: "eating-disorders",
    title: "Eating Disorders Awareness Quiz",
    questions: [
      {
        id: "ed-1",
        question: "Which of these is an eating disorder?",
        options: [
          "Being a picky eater",
          "Anorexia nervosa, bulimia nervosa, and binge eating disorder",
          "Only anorexia",
          "Choosing to diet occasionally"
        ],
        correctAnswer: 1,
        explanation: "Eating disorders include anorexia nervosa, bulimia nervosa, binge eating disorder (BED), ARFID, and others. They are serious mental health conditions, not lifestyle choices."
      },
      {
        id: "ed-2",
        question: "Can you tell if someone has an eating disorder by looking at them?",
        options: [
          "Yes, they always look underweight",
          "No, eating disorders affect people of all body sizes",
          "Only overweight people have eating disorders",
          "You can always tell by their behavior at meals"
        ],
        correctAnswer: 1,
        explanation: "Eating disorders affect people of all body sizes, ages, genders, and backgrounds. You cannot determine someone's health or eating disorder status based on appearance."
      },
      {
        id: "ed-3",
        question: "How does media influence body image?",
        options: [
          "Media has no effect on body image",
          "Media always promotes healthy body image",
          "Unrealistic beauty standards in media can contribute to body dissatisfaction",
          "Only social media affects body image"
        ],
        correctAnswer: 2,
        explanation: "Media often promotes unrealistic and narrow beauty standards, which research shows can contribute to body dissatisfaction and disordered eating behaviors."
      },
      {
        id: "ed-4",
        question: "What is the first step toward eating disorder recovery?",
        options: [
          "Going on a different diet",
          "Seeking professional help from specialists trained in eating disorders",
          "Trying to recover completely on your own",
          "Ignoring the problem"
        ],
        correctAnswer: 1,
        explanation: "The first step is seeking professional help from healthcare providers trained in eating disorders, as these are complex conditions requiring specialized treatment."
      },
      {
        id: "ed-5",
        question: "Are eating disorders a choice?",
        options: [
          "Yes, people choose to have eating disorders",
          "No, they are complex mental illnesses influenced by genetic, psychological, and social factors",
          "Only some eating disorders are choices",
          "They are just phases that people grow out of"
        ],
        correctAnswer: 1,
        explanation: "Eating disorders are not choices. They are serious mental illnesses with biological, psychological, and social contributing factors that require professional treatment."
      }
    ]
  },
  {
    courseId: "grief",
    title: "Grief & Loss Quiz",
    questions: [
      {
        id: "grf-1",
        question: "Are the 'stages of grief' a linear process?",
        options: [
          "Yes, everyone goes through them in order",
          "No, grief is unique and people may experience stages in any order or revisit them",
          "There are exactly 5 stages everyone experiences",
          "The stages only apply to death"
        ],
        correctAnswer: 1,
        explanation: "Grief is not linear. People may experience stages in any order, skip some, or revisit them. Everyone's grief journey is unique."
      },
      {
        id: "grf-2",
        question: "What types of loss can cause grief?",
        options: [
          "Only the death of a loved one",
          "Death, divorce, job loss, health changes, and other significant losses",
          "Only sudden losses",
          "Only losses that others consider important"
        ],
        correctAnswer: 1,
        explanation: "Grief can result from many types of loss: death, relationship endings, job loss, health changes, loss of identity, moving, and other significant life changes."
      },
      {
        id: "grf-3",
        question: "What is 'complicated grief'?",
        options: [
          "Normal grief",
          "Grief that is prolonged and significantly impairs daily functioning for an extended period",
          "Grief about a complicated person",
          "Feeling multiple emotions at once"
        ],
        correctAnswer: 1,
        explanation: "Complicated (prolonged) grief is when intense grief symptoms persist for an extended period and significantly impair a person's ability to function in daily life."
      },
      {
        id: "grf-4",
        question: "Is there a 'right' way to grieve?",
        options: [
          "Yes, you must cry and talk about it",
          "You should get over it within a few weeks",
          "No, everyone grieves differently and there is no single right way",
          "You should grieve alone"
        ],
        correctAnswer: 2,
        explanation: "There is no single right way to grieve. People express and process grief differently based on their personality, culture, relationship with what was lost, and support system."
      },
      {
        id: "grf-5",
        question: "How can you support someone who is grieving?",
        options: [
          "Tell them to move on",
          "Avoid mentioning the loss",
          "Be present, listen without judgment, and let them grieve at their own pace",
          "Try to fix their feelings"
        ],
        correctAnswer: 2,
        explanation: "The best support is being present, listening without judgment, acknowledging their pain, and allowing them to grieve at their own pace without pressure to 'get over it.'"
      }
    ]
  }
];
