import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What is TaskMate?",
    answer:
      "TaskMate is a task and project management application designed to help individuals and teams organize their work efficiently. It offers features like Kanban boards, task tracking, team collaboration tools, and AI-powered productivity insights to help you stay on top of your projects.",
  },
  {
    question: "How does the task tracking feature work?",
    answer:
      "TaskMate's task tracking system allows you to create, assign, and monitor tasks throughout their lifecycle. You can categorize tasks as 'To-Do', 'In Progress', 'Completed', 'In Review'. The analytics dashboard provides visual insights into your productivity patterns, helping you understand where your time is being spent.",
  },
  {
    question: "What makes TaskMate different from other task management apps?",
    answer:
      "TaskMate stands out with its intuitive user interface, AI-powered features, and comprehensive analytics. Our AI assistant helps prioritize tasks, suggest optimal workflows, and deliver productivity insights. With built-in Planning Poker, teams can estimate tasks collaboratively, while the integrated team chat ensures faster, more effective communication. Visual project tracking also makes it easy to understand your progress at a glance.",
  },
  {
    question: "Does TaskMate integrate with other tools like GitHub?",
    answer:
      "Not yet — TaskMate currently doesn’t offer integrations with external tools like GitHub. However, support for popular integrations is on our roadmap and coming soon. Stay tuned!",
  },
  {
    question: "How does the AI integration enhance productivity?",
    answer:
      "TaskMate's AI integration helps boost your productivity in several ways. It analyzes your work patterns to provide personalized productivity insights, automates routine task creation and updates, suggests task prioritization based on deadlines and importance, and helps identify potential bottlenecks in your projects before they occur.",
  },
]

export function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`bg-violet-200/20 dark:bg-white/5 backdrop-blur-md rounded-xl border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 ${
            activeIndex === index ? "shadow-lg shadow-purple-900/10" : ""
          }`}
        >
          <button
            className="w-full text-left p-6 flex justify-between items-center"
            onClick={() => toggleItem(index)}
            aria-expanded={activeIndex === index}
          >
            <h3 className="text-black dark:text-white font-medium text-lg">{faq.question}</h3>
            <div
              className={`ml-4 flex-shrink-0 h-6 w-6 rounded-full bg-violet-500/20 flex items-center justify-center transition-transform duration-300 ${
                activeIndex === index ? "rotate-180 " : ""
              }`}
            >
              <ChevronDown
                className={`h-4 w-4 transition-colors ${activeIndex === index ? "text-violet-400" : "text-white/60"}`}
              />
            </div>
          </button>

          <AnimatePresence initial={false}>
            {activeIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 pb-6 dark:text-white/70 text-black/70">
                  <div className="border-t border-violet-300/40 dark:border-white/10 pt-4">{faq.answer}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

