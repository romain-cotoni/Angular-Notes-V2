import { inject, Injectable } from '@angular/core';
import { NoteService } from './note.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private noteService = inject(NoteService);
  
  private editorTitleSubject = new BehaviorSubject<string>('');
  editorTitle$ = this.editorTitleSubject.asObservable();

  private editorContentSubject = new BehaviorSubject<string>('');
  editorContent$ = this.editorContentSubject.asObservable();

  ngOnInit() {
    
  }

  updateEditorTitleObservable(title: string) {
    this.editorTitleSubject.next(title);
  }

  updateEditorContentObservable(content: string) {
    this.editorContentSubject.next(content);
  }

  clear() {
    

  }

  unlock() {

  }

}
