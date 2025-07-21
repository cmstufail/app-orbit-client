import { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const UpVoteButton = ( { productId, initialVotes = 0, hasVoted = false } ) => {
    const [ voteCount, setVoteCount ] = useState( initialVotes );
    const [ userHasVoted, setUserHasVoted ] = useState( hasVoted );
    const [ loading, setLoading ] = useState( false );

    const handleUpvote = async () => {
        if ( userHasVoted ) {
            toast.error( 'You have already upvoted!' );
            return;
        }

        setLoading( true );

        try {
            const res = await fetch( `/api/products/${ productId }/upvote`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            } );

            if ( !res.ok ) {
                throw new Error( 'Failed to upvote' );
            }

            setVoteCount( voteCount + 1 );
            setUserHasVoted( true );
            toast.success( 'Thanks for your vote!' );
        } catch ( err ) {
            console.error( err );
            toast.error( 'Error submitting vote' );
        } finally {
            setLoading( false );
        }
    };

    return (
        <button
            onClick={ handleUpvote }
            disabled={ userHasVoted || loading }
            className={ `flex items-center gap-2 px-4 py-2 rounded-lg border 
        ${ userHasVoted
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } transition duration-300` }
        >
            <FaArrowUp />
            <span>{ voteCount }</span>
        </button>
    );
};

export default UpVoteButton;
