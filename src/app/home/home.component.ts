import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentTasks: any[] = [];
  currentPriority: string = 'high';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasksByPriority();
  }

  loadTasksByPriority(): void {
    this.taskService.getTasksByPriority(this.currentPriority).subscribe(
      (tasks) => {
        // แสดงงานที่มีสถานะ pending และ in_progress
        this.currentTasks = tasks.filter((task: any) => 
          task.Status === 'pending' || task.Status === 'in_progress'
        );

        // ถ้าไม่มีงานในสถานะ pending หรือ in_progress ในกลุ่มนี้ ให้เปลี่ยนไปกลุ่มถัดไป
        if (this.currentTasks.length === 0) {
          this.switchToNextPriority();
        }
      },
      (error) => console.error(`Error loading ${this.currentPriority} priority tasks:`, error)
    );
  }

  switchToNextPriority(): void {
    // เปลี่ยนกลุ่มตามลำดับจากสูง -> กลาง -> ต่ำ
    if (this.currentPriority === 'high') {
      this.currentPriority = 'medium';
    } else if (this.currentPriority === 'medium') {
      this.currentPriority = 'low';
    } else {
      this.currentPriority = ''; // ไม่มีงานให้แสดงแล้ว
    }

    // โหลดงานใหม่ตามกลุ่มใหม่
    if (this.currentPriority) {
      this.loadTasksByPriority();
    }
  }

  updateStatus(task: any, status: string): void {
    this.taskService.updateTaskStatus(task.TaskId, status).subscribe(
      () => {
        console.log('Task status updated successfully');
        this.loadTasksByPriority(); // รีโหลดงานตามกลุ่มปัจจุบันอีกครั้ง
      },
      (error) => console.error('Error updating task status:', error)
    );
  }

  // ฟังก์ชันเพื่อยกเลิก (ลบ) งานตาม ID
  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        console.log('Task deleted successfully');
        this.loadTasksByPriority(); // โหลดงานใหม่หลังจากลบสำเร็จ
      },
      (error) => console.error('Error deleting task:', error)
    );
  }
}
