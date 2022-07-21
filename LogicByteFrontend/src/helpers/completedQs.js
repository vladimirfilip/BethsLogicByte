class CompletedQs {
  constructor() {
    this.completed_qs = {};
    this.completed_q_ids = [];
  }
  add_q(id, question_data, user_answer) {
    this.completed_q_ids.push(id);
    this.completed_qs[id] = [question_data, user_answer];
  }
  get_q_data(id) {
    return this.completed_qs[id];
  }
  get get_ids() {
    return this.completed_q_ids;
  }
  clear_data() {
    this.completed_qs = {};
    this.completed_q_ids = [];
  }
}

let completed_qs = new CompletedQs();
export default completed_qs;
