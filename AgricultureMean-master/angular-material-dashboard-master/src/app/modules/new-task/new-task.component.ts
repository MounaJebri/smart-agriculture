import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/posts.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { WebRequestService } from 'src/app/web-request.service';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor( private authService : AuthService,private webReqService: WebRequestService,private taskService: PostsService, private route: ActivatedRoute, private router: Router) { }

  listId: string;
  
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.listId = params['listId'];
      }
    )
  }

  createTask(title: string) {
    this.taskService.createTask(title, this.listId).subscribe((newTask: Task) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    })


    let user = {
      name: title,
      email: "mouna.jabri@esprit.tn"
    }
    this.webReqService.sendEmail("http://localhost:3000/sendmail", user).subscribe(
      data => {
        let res:any = data; 
        console.log(
          `👏 > 👏 > 👏 > 👏 ${user.email} is successfully register and mail has been sent and the message id is ${res.messageId} you have an important task ${user.name}`
        );
     
  }
    )}

}
