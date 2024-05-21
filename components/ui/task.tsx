import { Button } from "@/components/ui/button";
import { Task as TaskType } from "@/types/task";
import { Pause, Play, Trash } from "lucide-react";
import { useStopwatch } from 'react-timer-hook';
import useLocalStorageState from "use-local-storage-state";
import { useEffect } from "react";

export default function Task({
  task
}:{
  task: TaskType;
}) {
  const [tasks, setTasks] = useLocalStorageState<TaskType[]>('tasks', {
    defaultValue: [],
  });

  const [mode, setMode] = useLocalStorageState<'working' | 'break'>('working')

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });

  useEffect(() => {
    if (minutes >= 25 && mode === 'working') {
      alert('25分経ちました！休憩を取りましょう！')
      setMode('break')
      setTasks((prev) => prev.map((item) => {
        if (item.id === task.id) {
          return {
            ...item,
            completed: true,
          }
        }else{
          return item;
        }
      }))
      reset();
    }
    if (minutes >= 5 && mode === 'break') {
      alert('5分経ちました！作業を再開しましょう！')
      setMode('working')
      reset();
    }
  }, [minutes, mode, setMode, reset, setTasks, task.id])

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  return (
    <div key={task.id} className="p-4 flex gap-2 items-center tabular-nums border rounded-md">
      {task.completed && <span className="p-2 py-1.5 border rounded bg-muted text-muted-foreground">完了</span>}
      {task.title}

      <span className="flex-1"></span>

      <p className="text-muted-forground  text-sm">
        {formatTime(minutes)}:{formatTime(seconds)}
      </p>

      {isRunning ? (
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          onClick={pause}
        >
          <Pause size={18}/>
          <span className="sr-only">タスク停止</span>
        </Button>
      ) : (
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          onClick={start}
        >
          <Play size={18}/>
          <span className="sr-only">タスク開始</span>
        </Button>
      )}

      <Button 
        variant="ghost" 
        size="icon" 
        className="text-muted-foreground"
        onClick={() => setTasks((prev) => prev.filter((item) => item.id !== task.id))}
      >
        <Trash size={18}/>
        <span className="sr-only">{task.title}を削除</span>
      </Button>
    </div>
  )
}