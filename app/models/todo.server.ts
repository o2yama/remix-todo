import { Todo } from "@prisma/client";

import { prisma } from "~/db.server";

export const getTodos = () => {
  return prisma.todo.findMany();
};

interface GetTodoArgs {
  id: string;
}
export const getTodo = ({ id }: GetTodoArgs) => {
  return prisma.todo.findUnique({ where: { id } });
};

export const createTodo = (todo: Pick<Todo, "title" | "deadline">) => {
  return prisma.todo.create({ data: todo });
};

interface UpdateTodoArgs {
  id: string;
  todo: Pick<Todo, "title" | "deadline" | "isDone">;
}
export const updateTodo = ({ id, todo }: UpdateTodoArgs) => {
  return prisma.todo.update({
    where: { id },
    data: todo,
  });
};

interface DeleteTodoArgs {
  id: string;
}
export const deleteTodo = ({ id }: DeleteTodoArgs) => {
  return prisma.todo.delete({ where: { id } });
};
