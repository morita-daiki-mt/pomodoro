'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Task from "@/components/ui/task";
import { Task as TaskType } from "@/types/task";
import { Pause, Play, Trash } from "lucide-react";
import { useForm } from "react-hook-form"
import useLocalStorageState from "use-local-storage-state";

type FormType = {
  title: string;
}

export default function Home() {
  const [tasks, setTasks] = useLocalStorageState<TaskType[]>('tasks', {
    defaultValue: [],
  });

  const {handleSubmit, register, formState: {isValid}, reset} = useForm<FormType>({
    mode: 'onChange',
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: FormType) => {
    setTasks((prev) => [
      ...prev, 
      {
      id: crypto.randomUUID(),
      title: data.title,
      }
    ]);

    reset();
  };

  return (
    <main className="container">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-2 mx-auto bg-muted p-6 border rounded-lg">
        <div>
          <label htmlFor="title">タスク名</label>
          <Input {...register("title", {required: true})} autoComplete="off" id="title"></Input>
        </div>
        <Button disabled={!isValid}>作成</Button>
      </form>

      <h2>Task List</h2>

      <div className="space-y-2">
        {tasks.map((task) => {
          return (
            <Task key={task.id} task={task}/>
          )
        })}
      </div>
    </main>
  );
}
