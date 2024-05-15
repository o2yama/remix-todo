import {
  json,
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import invariant from "tiny-invariant";

import { getTodo, updateTodo } from "~/models/todo.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.todoId);
  const todo = await getTodo({ id: params.todoId });
  invariant(todo);
  return json({ todo });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const deadline = formData.get("deadline") as string;
  const isDone = formData.get("isDone") === "done";

  const errors = {
    title: title ? "" : "タイトルは必須です",
    deadline: deadline ? "" : "期限は必須です",
  };

  const hasError = Object.values(errors).some((errorMsg) => errorMsg);

  if (hasError) {
    return json(errors);
  }

  invariant(params.todoId);
  invariant(typeof title === "string");
  invariant(typeof deadline === "string");

  await updateTodo({ id: params.todoId, todo: { title, deadline, isDone } });

  return redirect(`/todos/`);
};

const EditTodo: FC = () => {
  const { todo } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  return (
    <>
      <h2>編集画面</h2>
      <Form method="post">
        <div>
          <label>
            タイトル
            {errors?.title ? (
              <p style={{ color: "red" }}>{errors.title}</p>
            ) : null}
            <input type="text" name="title" defaultValue={todo.title} />
          </label>
        </div>
        <div>
          <label>
            期限
            {errors?.deadline ? (
              <p style={{ color: "red" }}>{errors.deadline}</p>
            ) : null}
            <input type="date" name="deadline" defaultValue={todo.deadline} />
          </label>
        </div>
        <div>
          <input
            id="done"
            type="radio"
            name="isDone"
            value="done"
            defaultChecked={todo.isDone}
          />
          <label htmlFor="done">完了</label>
          <input
            id="yet"
            type="radio"
            name="isDone"
            value="yet"
            defaultChecked={!todo.isDone}
          />
          <label htmlFor="yet">未着手</label>
        </div>
        <div>
          <button type="submit">更新</button>
        </div>
      </Form>
    </>
  );
};

export default EditTodo;
