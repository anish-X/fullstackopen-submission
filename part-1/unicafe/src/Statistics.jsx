import StatisticsLine from "./StatisticsLine";

const Statistics = (props) => {
  return (
    <div>
        <StatisticsLine text = "good" value={props.good} />
        <StatisticsLine text = "neutral" value={props.neutral} />
        <StatisticsLine text = "bad" value={props.bad} />
        <StatisticsLine text = "all" value={props.all} />
        <StatisticsLine text = "average" value={props.average} />
        <StatisticsLine text = "postive" value={props.positive} />
    </div>
  );
};

export default Statistics;
