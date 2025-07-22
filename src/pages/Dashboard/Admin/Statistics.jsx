import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useEffect } from 'react';

const COLORS = [ '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DD00', '#FF6666', '#7C4DFF' ];


const CustomPieChartLabel = ( { cx, cy, midAngle, outerRadius, percent, name, value, fill } ) => {
  if ( value === 0 ) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos( -midAngle * RADIAN );
  const y = cy + radius * Math.sin( -midAngle * RADIAN );

  return (
    <text
      x={ x }
      y={ y }
      fill={ fill }
      textAnchor={ x > cx ? 'start' : 'end' }
      dominantBaseline="central"
      className="text-sm font-semibold"
    >
      { `${ name }: ${ ( percent * 100 ).toFixed( 0 ) }%` }
    </text>
  );
};


const Statistics = () => {

  useEffect( () => {
    document.title = 'Statistics || AppOrbit';
  }, [] );

  const axiosSecure = useAxiosSecure();

  const {
    data: stats = {},
    isLoading,
    isError,
    error: errorObject
  } = useQuery( {
    queryKey: [ 'adminStatistics' ],
    queryFn: async () => {
      console.log( "StatisticsPage: Attempting to fetch stats from /admin/stats" );
      try {
        const res = await axiosSecure.get( '/admin/stats' );
        console.log( "StatisticsPage: Raw backend response for stats:", res.data );
        return res.data;
      } catch ( axiosError ) {
        console.error( "StatisticsPage: Error fetching stats (AxiosError):", axiosError.response?.data || axiosError.message );
        throw new Error( axiosError.response?.data?.message || axiosError.message || 'Failed to fetch statistics.' );
      }
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
  } );

  const {
    totalProducts = 0,
    acceptedProducts = 0,
    pendingProducts = 0,
    totalUsers = 0,
    totalReviews = 0
  } = stats;


  const chartData = [
    { name: 'Accepted Products', value: acceptedProducts },
    { name: 'Pending Products', value: pendingProducts },

    { name: 'Total Users', value: totalUsers },
    { name: 'Total Reviews', value: totalReviews },
  ].filter( item => item.value > 0 );

  if ( isLoading ) {
    return (
      <div className="text-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if ( isError ) {
    console.error( "StatisticsPage: Displaying error message. Error details:", errorObject );
    return (
      <div className="text-center py-10 text-red-500">
        <p>Error loading statistics: { errorObject.message }</p>
        <p>Please ensure backend /admin/stats endpoint is running and returning valid data.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">📊 Admin Statistics Overview</h2>

      <div className="bg-base-100 shadow-md rounded-lg p-4">
        { chartData.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No statistics data available to display in chart.</p>
            <p>Please ensure you have products, users, and reviews in your database.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={ 400 }>
            <PieChart>
              <Pie
                data={ chartData }
                cx="50%"
                cy="50%"
                outerRadius={ 120 }
                fill="#8884d8"
                dataKey="value"
                label={ CustomPieChartLabel }
                labelLine={ false }
              >
                { chartData.map( ( _, index ) => (
                  <Cell key={ `cell-${ index }` } fill={ COLORS[ index % COLORS.length ] } />
                ) ) }
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={ 36 } />
            </PieChart>
          </ResponsiveContainer>
        ) }
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 text-center">
        <div className="card bg-base-100 shadow-md p-4">
          <h4 className="text-xl font-semibold">Total Products</h4>
          <p className="text-3xl font-bold text-primary">{ totalProducts }</p>
        </div>
        <div className="card bg-base-100 shadow-md p-4">
          <h4 className="text-xl font-semibold">Total Users</h4>
          <p className="text-3xl font-bold text-success">{ totalUsers }</p>
        </div>
        <div className="card bg-base-100 shadow-md p-4">
          <h4 className="text-xl font-semibold">Total Reviews</h4>
          <p className="text-3xl font-bold text-info">{ totalReviews }</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;







