export default class Todo {
    id: string;
    label: string;
    completed: boolean;
    date: Date;

    constructor(data: Todo) {
        this.id = data.id;
        this.label = data.label;
        this.completed = data.completed;
        this.date = data.date;
    }
}
