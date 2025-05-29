import chalk, { Chalk } from "chalk";
import { formatDistanceToNow, parseISO, isPast } from "date-fns";
import { Todo } from "../types/todo.js";

export const colors = {
  primary: chalk.blue,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.cyan,
  muted: chalk.gray,
  high: chalk.red,
  medium: chalk.yellow,
  low: chalk.green,
  completed: chalk.gray.strikethrough,
  overdue: chalk.red.bold,
};

export function getPriorityColor(priority: string): typeof chalk {
  switch (priority) {
    case "high":
      return colors.high;
    case "medium":
      return colors.medium;
    case "low":
      return colors.low;
    default:
      return chalk.white;
  }
}

export function getStatusIcon(completed: boolean): string {
  return completed ? colors.success("✓") : colors.muted("○");
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Invalid date";
  }
}

export function formatDueDate(dueDate?: string): string {
  if (!dueDate) return "";

  try {
    const date = parseISO(dueDate);
    const isOverdue = isPast(date);
    const formatted = formatDistanceToNow(date, { addSuffix: true });

    return isOverdue
      ? colors.overdue(`⚠ Due ${formatted}`)
      : colors.warning(`📅 Due ${formatted}`);
  } catch {
    return colors.muted("Invalid due date");
  }
}

export function formatTags(tags: string[]): string {
  if (!tags.length) return "";
  return tags.map((tag) => colors.info(`#${tag}`)).join(" ");
}

export function formatTodoTitle(todo: Todo): string {
  const icon = getStatusIcon(todo.completed);
  const priorityColor = getPriorityColor(todo.priority);
  const title = todo.completed
    ? colors.completed(todo.title)
    : priorityColor(todo.title);

  return `${icon} ${title}`;
}

export function formatTodoDescription(description?: string): string {
  if (!description) return "";
  return colors.muted(`   ${description}`);
}

export function formatTodoMeta(todo: Todo): string {
  const parts: string[] = [];

  // Priority
  const priorityColor = getPriorityColor(todo.priority);
  parts.push(priorityColor(`[${todo.priority.toUpperCase()}]`));

  // Due date
  if (todo.dueDate) {
    parts.push(formatDueDate(todo.dueDate));
  }

  // Tags
  if (todo.tags.length > 0) {
    parts.push(formatTags(todo.tags));
  }

  // Created date
  parts.push(colors.muted(`Created ${formatDate(todo.created)}`));

  return `   ${parts.join(" • ")}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

export function centerText(text: string, width: number): string {
  const padding = Math.max(0, width - text.length) / 2;
  return (
    " ".repeat(Math.floor(padding)) + text + " ".repeat(Math.ceil(padding))
  );
}
