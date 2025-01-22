export interface ActiveSessions {
    message: string;
    data:    Datum[];
}

export interface Datum {
    session_id:   string;
    session_name: string;
    created_at:   Date;
    created_by:   string;
    description:  string;
    is_active:    boolean;
    session_code: string;
    voting_scale: string;
    status:       string;
}
