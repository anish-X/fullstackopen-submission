import Part from "./Part";

const Content = (props) => {
  return (
    <div>
      <Part part={props.kpart1} exercises={props.kexercises1} />
      <Part part={props.kpart2} exercises={props.kexercises2}/>
      <Part part={props.kpart3} exercises={props.kexercises3}/>
    </div>
  );
};

export default Content;
