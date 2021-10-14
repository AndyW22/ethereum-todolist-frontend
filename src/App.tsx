import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import './App.css';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './config';

export interface Task {
  completed: boolean;
  content: string;
  id: string;
}

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [todoList, setTodoList] = useState<Contract | null>(null);
  const [taskCount, setTaskCount] = useState<number[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadBlockchainData = async () => {
      setLoading(true);

      // Load web 3 + network + accounts
      const web3 = new Web3('http://localhost:7545');
      const network = await web3.eth.net.getNetworkType();
      const accounts = await web3.eth.getAccounts();
      setNetwork(network);
      setAccount(accounts[0]);

      // Fetch contract
      const todoList = new web3.eth.Contract(
        TODO_LIST_ABI as AbiItem[],
        TODO_LIST_ADDRESS
      );
      setTodoList(todoList);

      // Call taskCount method on the contract
      const taskCountData = await todoList.methods.taskCount().call();
      setTaskCount(taskCountData);

      // Call tasks mapping on the contract
      for (let i = 1; i <= taskCountData; i++) {
        const task: Task = await todoList.methods.tasks(i).call();
        console.log(task.completed);
        setTasks([...tasks, task]);
      }

      setLoading(false);
    };
    loadBlockchainData();
  }, []);

  return (
    <div>
      {loading ? (
        <>Loading...</>
      ) : (
        <div className='container'>
          <h1>Current Network: {network}</h1>
          <h2>Account address: {account}</h2>
          <h2>Total tasks on blockchain: {taskCount}</h2>
          {tasks.map((task) => (
            <div key={task.id}>
              task {task.id}: {task.content}.
              {task.completed ? <>Completed</> : <>Not Completed</>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
