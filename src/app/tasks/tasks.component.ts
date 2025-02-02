import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasksForm: FormGroup;
  tasks_high: any[] = [];
  tasks_medium: any[] = [];
  tasks_low: any[] = [];

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.tasksForm = this.fb.group({
      taskName: ['', Validators.required],
      taskDescription: [''],
      taskDueDate: ['', Validators.required],
      taskPriority: ['1', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (data) => {
        // กรองงานที่ไม่ได้อยู่ในสถานะ done และแยกตามระดับความสำคัญ
        this.tasks_high = data.filter((task: any) => task.Priority === 'high' && task.Status !== 'done');
        this.tasks_medium = data.filter((task: any) => task.Priority === 'medium' && task.Status !== 'done');
        this.tasks_low = data.filter((task: any) => task.Priority === 'low' && task.Status !== 'done');
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  addNewTask(): void {
    if (this.tasksForm.valid) {
      const priorityMap: { [key: string]: string } = { '1': 'high', '2': 'medium', '3': 'low' };
      const newTask = {
        title: this.tasksForm.value.taskName,
        description: this.tasksForm.value.taskDescription,
        dueDate: this.tasksForm.value.taskDueDate,
        priority: priorityMap[this.tasksForm.value.taskPriority as string],
        status: 'pending'
      };

      this.taskService.addTask(newTask).subscribe(
        (response) => {
          if (response.status === 201) {
            this.loadTasks();
            this.tasksForm.reset({ taskPriority: '1' });
          }
        },
        (error) => {
          console.error('Error adding task:', error);
        }
      );
    }
  }

  drop(event: CdkDragDrop<any[]>, priority: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const movedTask = event.container.data[event.currentIndex];
      movedTask.Priority = priority;

      // อัปเดต Priority ในฐานข้อมูล
      this.taskService.updateTaskPriority(movedTask.TaskId, priority).subscribe(
        () => console.log('Task priority updated successfully'),
        (error) => console.error('Error updating task priority:', error)
      );
    }
  }
}
