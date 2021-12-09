import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/posts.service';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Node } from 'src/app/models/node.model';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  selectedNodeId: string;
  nodes: Node[];
  

  constructor(private postService: PostsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.refreshEmployeeList();

    this.route.params.subscribe(
      (params: Params) => {
        if (params.nodeId) {
          this.selectedNodeId = params.nodeId;
        } else {
          this.nodes = undefined;
        }
      }
    )

    this.postService.getNodes().subscribe((nodes: Node[]) => {
      this.nodes = nodes;
    })
    
  }
  refreshEmployeeList() {
    this.postService.getNodes().subscribe((res) => {
      this.postService.nodes = res as Node[];
  
      
    });
  }
  
  createNode(address: string ,type : string ,activeornot : boolean ,batterylevel : number,electrovan : boolean,mode : number) {
    this.postService.createNode( address,type,activeornot,batterylevel,electrovan,mode).subscribe((node: Node) => {
      
      // Now we navigate to /lists/task._id
      this.router.navigate([ '/posts' , node._id ]); 
      console.log(node);
    });
  }
  
  onDeleteNodeClick( id  : string ) {
    this.postService.deleteNode(id).subscribe((res: any) => {
      
      this.router.navigate(['/posts']);
      console.log(res);
      
      
    })
  }
  
  
}


