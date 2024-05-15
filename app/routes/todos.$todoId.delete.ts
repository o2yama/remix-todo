import { ActionFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteTodo } from "~/models/todo.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.todoId);
  await deleteTodo({ id: params.todoId });
  return redirect("/todos");
};
