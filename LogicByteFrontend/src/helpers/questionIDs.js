class QuestionIDs {
  constructor() {
    // this.ids = [1, 2, 3];
    this.ids = [1];
  }
  get get_ids() {
    return this.ids;
  }
  set set_ids(new_ids) {
    this.ids = new_ids;
  }
  clear_data() {
    this.ids = null;
  }
}

let questionIDs = new QuestionIDs();
export default questionIDs;
