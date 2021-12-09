import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/posts.service';
import { Router } from '@angular/router';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(private postsService: PostsService, private router: Router) { }

  ngOnInit() {
  }

  createList(title: string) {
    this.postsService.createList(title).subscribe((list: List) => {
      console.log(list);
      // Now we navigate to /lists/task._id
      this.router.navigate([ '/lists', list._id ]); 
    });
  }

}
