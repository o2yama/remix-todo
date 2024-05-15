import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { FC } from "react";
import invariant from "tiny-invariant";

import { createTodo } from "~/models/todo.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const deadline = formData.get("deadline") as string;

  const errors: Record<string, string> = {
    title: !title ? "タイトルは必須です" : "",
    deadline: !deadline ? "期限は必須です" : "",
  };

  const hasErrors = Object.values(errors).some((error) => !!error);

  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title should be a string");
  invariant(typeof deadline === "string", "deadline should be a string");

  await createTodo({
    title,
    deadline,
  });

  return redirect("/todos");
};

const CreateTodo: FC = () => {
  const errors = useActionData<typeof action>();
  return (
    <>
      <h2 className="font-medium text-3xl">新規追加画面</h2>
      <Form method="post">
        <div className="py-2">
          <label
            htmlFor="title"
            className="text-sm text-gray-700 block mb-1 font-medium py-2"
          >
            タイトル
          </label>
          <input
            id="title"
            type="text"
            name="title"
            className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
            placeholder="タイトルを入力してください"
          />
          {errors?.title ? (
            <div className="py-2 bg-white text-red-500 justify-between rounded">
              <div className="flex items-center">
                <p>{errors?.title}</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="py-2">
          <label
            htmlFor="deadline"
            className="text-sm text-gray-700 block mb-1 font-medium py-2"
          >
            期限
          </label>
          <input
            id="deadline"
            type="date"
            name="deadline"
            className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
          />
          {errors?.deadline ? (
            <div className="py-2 bg-white text-red-500 justify-between rounded">
              <div className="flex items-center">
                <p>{errors?.deadline}</p>
              </div>
            </div>
          ) : null}
        </div>
        <div>
          <button
            type="submit"
            className="py-1.5 px-4 mt-16 flex items-center space-x-2 transition-colors bg-green-600 border active:bg-green-800 font-medium border-green-700 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            登録
          </button>
        </div>
      </Form>
    </>
  );
};

export default CreateTodo;
