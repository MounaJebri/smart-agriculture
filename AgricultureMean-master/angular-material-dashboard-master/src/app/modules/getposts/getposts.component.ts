import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/posts.service';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Node } from 'src/app/models/node.model';
import { Sensornode } from 'src/app/models/Sensornode.model';
import { Gatewaynode } from 'src/app/models/Gatewaynode.model';
import { Tanknode } from 'src/app/models/tanknode.model';
import { debug } from 'util';
@Component({
  selector: 'app-getposts',
  templateUrl: './getposts.component.html',
  styleUrls: ['./getposts.component.scss']
})
export class GetpostsComponent implements OnInit {

  nodes: Node[];
  sensornodes: Sensornode[];
  gatewaynode : Gatewaynode[];
  tanknode : Tanknode[];
  nodeId: string;
  selectedNodeId: string;

  selectedSensornodeId : string;

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

    this.postService.getSensornode(this.nodeId).subscribe((sensornodes: Sensornode[]) => {
      this.sensornodes = sensornodes;})

      this.postService.getGatewaynode(this.nodeId).subscribe((gatewaynode: Gatewaynode[]) => {
        this.gatewaynode = gatewaynode;})

        this.postService.getTanknode(this.nodeId).subscribe((tanknode: Tanknode[]) => {
          this.tanknode = tanknode;
    })

  }
  refreshEmployeeList() {
    this.postService.getNodes().subscribe((res) => {
      this.postService.nodes = res as Node[];
  
      
    });
  }
  /*  
  createSensornode(Ram: number ,smoke :number  ,temperature : number ,humidity : number,moisture : number,time : string , electrovan : boolean) {
    this.postService.createSensornode( Ram,smoke,temperature,humidity,moisture,time,electrovan,"5ec16e97175f3a2ef0a73ae3",).subscribe((newSensornode: Sensornode) => {
      
      this.router.navigate([ '/getposts' ]);
      
    }); 
  
   } */
}
  
  
  

