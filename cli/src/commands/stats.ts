import ora from "ora";
import Table from "cli-table3";
import { TodoService } from "../services/todoService.js";
import { colors } from "../utils/formatting.js";

export async function showStats(todoService: TodoService): Promise<void> {
  const spinner = ora("Calculating statistics...").start();

  try {
    const [stats, overdueTodos] = await Promise.all([
      todoService.getStats(),
      todoService.getOverdueTodos(),
    ]);

    spinner.stop();

    console.log(colors.primary("\n📊 Todo Statistics\n"));

    // Overview stats table
    const overviewTable = new Table({
      head: [
        colors.primary("Metric"),
        colors.primary("Count"),
        colors.primary("Percentage"),
      ],
      colWidths: [20, 10, 15],
      style: {
        head: [],
        border: ["grey"],
      },
    });

    const completionRate =
      stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    const pendingRate =
      stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;
    const overdueRate =
      stats.total > 0
        ? Math.round((overdueTodos.length / stats.total) * 100)
        : 0;

    overviewTable.push(
      [
        colors.info("Total Todos"),
        colors.primary(stats.total.toString()),
        colors.muted("100%"),
      ],
      [
        colors.success("Completed"),
        colors.success(stats.completed.toString()),
        colors.success(`${completionRate}%`),
      ],
      [
        colors.warning("Pending"),
        colors.warning(stats.pending.toString()),
        colors.warning(`${pendingRate}%`),
      ],
      [
        colors.error("Overdue"),
        colors.error(overdueTodos.length.toString()),
        colors.error(`${overdueRate}%`),
      ]
    );

    console.log(overviewTable.toString());

    // Priority breakdown table
    console.log(colors.primary("\n🎯 Priority Breakdown\n"));

    const priorityTable = new Table({
      head: [
        colors.primary("Priority"),
        colors.primary("Count"),
        colors.primary("Percentage"),
      ],
      colWidths: [15, 10, 15],
      style: {
        head: [],
        border: ["grey"],
      },
    });

    const highRate =
      stats.total > 0
        ? Math.round((stats.byPriority.high / stats.total) * 100)
        : 0;
    const mediumRate =
      stats.total > 0
        ? Math.round((stats.byPriority.medium / stats.total) * 100)
        : 0;
    const lowRate =
      stats.total > 0
        ? Math.round((stats.byPriority.low / stats.total) * 100)
        : 0;

    priorityTable.push(
      [
        colors.error("High"),
        colors.error(stats.byPriority.high.toString()),
        colors.error(`${highRate}%`),
      ],
      [
        colors.warning("Medium"),
        colors.warning(stats.byPriority.medium.toString()),
        colors.warning(`${mediumRate}%`),
      ],
      [
        colors.success("Low"),
        colors.success(stats.byPriority.low.toString()),
        colors.success(`${lowRate}%`),
      ]
    );

    console.log(priorityTable.toString());

    // Progress indicator
    if (stats.total > 0) {
      console.log(colors.primary("\n📈 Progress\n"));

      const progressWidth = 40;
      const completedWidth = Math.round(
        (stats.completed / stats.total) * progressWidth
      );
      const progressBar =
        "█".repeat(completedWidth) + "░".repeat(progressWidth - completedWidth);

      console.log(`${colors.success(progressBar)} ${completionRate}% Complete`);
      console.log("");
    }

    // Quick insights
    if (stats.total > 0) {
      console.log(colors.primary("💡 Insights\n"));

      const insights: string[] = [];

      if (completionRate >= 80) {
        insights.push(
          colors.success("🎉 Great job! You're completing most of your todos.")
        );
      } else if (completionRate < 30) {
        insights.push(
          colors.warning(
            "⚡ Consider reviewing your todo load - many items are pending."
          )
        );
      }

      if (overdueTodos.length > 0) {
        insights.push(
          colors.error(
            `⏰ You have ${overdueTodos.length} overdue todo${
              overdueTodos.length !== 1 ? "s" : ""
            } that need attention.`
          )
        );
      }

      if (
        stats.byPriority.high >
        stats.byPriority.medium + stats.byPriority.low
      ) {
        insights.push(
          colors.warning(
            "🔥 You have many high-priority items. Consider if they all need urgent attention."
          )
        );
      }

      if (insights.length === 0) {
        insights.push(colors.info("📝 Your todo list looks well-balanced!"));
      }

      insights.forEach((insight) => console.log(`   ${insight}`));
      console.log("");
    } else {
      console.log(
        colors.muted(
          "📝 No todos yet. Use `todo add` to create your first todo!\n"
        )
      );
    }
  } catch (error) {
    spinner.stop();
    console.error(
      colors.error(
        `\n❌ Error calculating statistics: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`
      )
    );
  }
}

export async function showOverdue(todoService: TodoService): Promise<void> {
  const spinner = ora("Loading overdue todos...").start();

  try {
    const overdueTodos = await todoService.getOverdueTodos();

    spinner.stop();

    if (overdueTodos.length === 0) {
      console.log(
        colors.success("\n✅ No overdue todos! You're all caught up.\n")
      );
      return;
    }

    console.log(
      colors.error(
        `\n⏰ ${overdueTodos.length} Overdue Todo${
          overdueTodos.length !== 1 ? "s" : ""
        }\n`
      )
    );

    overdueTodos.forEach((todo, index) => {
      console.log(colors.error(`❗ ${todo.title}`));

      if (todo.description) {
        console.log(colors.muted(`   ${todo.description}`));
      }

      const dueDate = new Date(todo.dueDate!);
      const daysPastDue = Math.ceil(
        (Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      console.log(
        colors.error(
          `   ⚠️  ${daysPastDue} day${
            daysPastDue !== 1 ? "s" : ""
          } overdue • Priority: ${todo.priority.toUpperCase()}`
        )
      );

      if (index < overdueTodos.length - 1) {
        console.log("");
      }
    });

    console.log("");
    console.log(
      colors.warning(
        `💡 Tip: Use "todo complete" to mark these as done, or "todo edit" to update due dates.\n`
      )
    );
  } catch (error) {
    spinner.stop();
    console.error(
      colors.error(
        `\n❌ Error loading overdue todos: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n`
      )
    );
  }
}
