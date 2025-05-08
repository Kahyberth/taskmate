export interface Projects {
    id:           string;
    name:         string;
    description:  string;
    status:       string;
    type:         string;
    createdBy:    string;
    is_available: boolean;
    team_id:      string;
    project_key:  string;
    tags:         string;
    createdAt:    Date;
    updatedAt:    Date;
    deletedAt:    null;
    members:      Member[];
    epic:         any[];
    backlog:      null;
    sprint:       any[];
    logging:      any[];
}

export interface Member {
    id:       string;
    user_id:  string;
    joinedAt: Date;
    leaveAt:  null;
}
