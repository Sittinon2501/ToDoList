import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  highPriorityTasks: any[] = [];
  mediumPriorityTasks: any[] = [];
  lowPriorityTasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadDoneTasks();
  }

  loadDoneTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (tasks) => {
        // กรองงานที่มีสถานะเป็น done และแยกตามลำดับความสำคัญ
        this.highPriorityTasks = tasks.filter((task: any) => task.Status === 'done' && task.Priority === 'high');
        this.mediumPriorityTasks = tasks.filter((task: any) => task.Status === 'done' && task.Priority === 'medium');
        this.lowPriorityTasks = tasks.filter((task: any) => task.Status === 'done' && task.Priority === 'low');
      },
      (error) => console.error('Error loading done tasks:', error)
    );
  }
}
