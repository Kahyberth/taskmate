import { apiClient } from '@/api/client-gateway';
import React, { useEffect, useState } from 'react';


type TeamMember = {
  userId: string;
  teamId: string;
  roleInTeam: string;
  user: {
    id: string;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    language: string;
    company: string;
    isActive: boolean;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin: string | null;
  };
};

type Props = {
  teamId: string;
};



//TODO: Revisar
const TeamMembersList: React.FC<Props> = ({ teamId }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {

        await apiClient.get(`/get-members-by-team/${teamId}`)
        .then((response) => {
            console.log("response.data desde teamMembersList", response.data);
            setMembers(response.data);
        })
        .catch((error) => {
            setError(error.message);
        })
        .finally(() => {
            setLoading(false);
        })
    };

    fetchMembers();
  }, [teamId]);

  if (loading) return <p>Loading team members...</p>;
  if (error) return <p>Error: {error}</p>;
  if (members.length === 0) return <p>No members found for this team.</p>;

  return (
    <div>
      <h2>Team Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.member.id} style={{ marginBottom: '1rem' }}>
            <strong>
              {member.member.name} {member.member.lastName}
            </strong>{' '}
            - <em>{member.roleInTeam}</em>
            <br />
            Email: {member.member.email}
            <br />
            Company: {member.member.company}
            <br />
            Status: {member.member.isActive ? 'Active' : 'Inactive'}, Available:{' '}
            {member.member.isAvailable ? 'Yes' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamMembersList;
