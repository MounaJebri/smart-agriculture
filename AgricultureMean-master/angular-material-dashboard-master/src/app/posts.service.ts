import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from './models/Task.model';
import { Node } from './models/Node.model';
import { Sensornode } from './models/Sensornode.model';
import { Gatewaynode } from './models/Gatewaynode.model';
import { List } from './models/list.model';
import { Tanknode } from './models/tanknode.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  nodes : Node[];
  lists : List[];
  sensornode: Sensornode[];
  gatewaynode : Gatewaynode[];
  tanknode : Tanknode[];
  constructor(private webReqService: WebRequestService) { }

  
  getNodes() {
    return this.webReqService.get('node');
  }

  createNode(address: string ,type : string ,activeornot : boolean ,batterylevel : number,electrovan : boolean,mode : number) {
    // We want to send a web request to create a list
    return this.webReqService.post('nodes', { address,type,activeornot,batterylevel,electrovan,mode });
  }

  updateNode(id: string, address: string ,type : string ,activeornot : boolean ,batterylevel : number,electrovan : boolean,mode : number) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`nodes/${id}`, { address,type,activeornot,batterylevel,electrovan,mode });
  }
  deleteNode(id: string) {
    return this.webReqService.delete(`nodes/${id}`);
  }

  getLists() {
    return this.webReqService.get('list');
  }

  createList(title: string) {
    // We want to send a web request to create a list
    return this.webReqService.post('lists', { title });
  }

  updateList(id: string, title: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`lists/${id}`, { title });
  }

  updateTask(listId: string, taskId: string, title: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { title });
  }

  deleteTask(listId: string, taskId: string) {
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  deleteList(id: string) {
    return this.webReqService.delete(`lists/${id}`);
  }

  getTasks(listId: string) {
    return this.webReqService.get(`list/${listId}/task`);
  }

  getSensornode(nodeId: string) { 
    return this.webReqService.get(`node/${nodeId}/sensornodes`);
  }

  getTanknode(nodeId: string) { 
    return this.webReqService.get(`node/${nodeId}/tanknodes`);
  }

  getGatewaynode(nodeId: string) { 
    return this.webReqService.get(`node/${nodeId}/getwaynodes`);
  }
  getGatewaynodes(nodeId: string) { 
    return this.webReqService.get(`node/${nodeId}/getwaynode`);
  }

  createTask(title: string, listId: string) {
    // We want to send a web request to create a task
    return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }

  createSensornode(Ram: number ,smoke :number  ,temperature : number ,humidity : number,moisture : number,time : string , electrovan : boolean,nodeId : string ){
    // We want to send a web request to create a task
    return this.webReqService.post(`nodes/${nodeId}/sensornode`, {Ram,smoke,temperature,humidity,moisture,time,electrovan});
  }

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
}
