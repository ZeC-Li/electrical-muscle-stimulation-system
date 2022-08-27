FIS_CELEC = mamfis;

FIS_CELEC = addInput(FIS_CELEC,[-40 40],'Name','E');
FIS_CELEC = addMF(FIS_CELEC,'E','trimf',  [-53.34 -40 -26.66],'Name','NB');
FIS_CELEC = addMF(FIS_CELEC,'E','trimf',  [-40 -26.66 -13.34],'Name','NM');
FIS_CELEC = addMF(FIS_CELEC,'E','trimf',  [-26.66 -13.34 0],'Name','NS');
FIS_CELEC = addMF(FIS_CELEC,'E','trimf',  [-13.34 0 13.34],'Name','Z');
FIS_CELEC = addMF(FIS_CELEC,'E','trimf',  [0 13.34 26.66],'Name','PS');
FIS_CELEC = addMF(FIS_CELEC,'E','trimf',  [13.34 26.66 40],'Name','PM');
FIS_CELEC = addMF(FIS_CELEC,'E','trimf', [26.66 40 53.36],'Name','PB');

FIS_CELEC = addInput(FIS_CELEC,[-40 40],'Name','EC');
FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',  [-53.34 -40 -26.66],'Name','NB');
FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',  [-40 -26.66 -13.34],'Name','NM');
FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',  [-26.66 -13.34 0],'Name','NS');
FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',  [-13.34 0 13.34],'Name','Z');
FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',  [0 13.34 26.66],'Name','PS');
FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',  [13.34 26.66 40],'Name','PM');
FIS_CELEC = addMF(FIS_CELEC,'EC','trimf', [26.66 40 53.36],'Name','PB');



% FIS_CELEC = addInput(FIS_CELEC,[-20 20],'Name','EC');
% FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',[-26.67 -20 -13.33],'Name','NB');
% FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',[-20 -13.33 -6.668],'Name','NM');
% FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',[-13.33 -6.668 0],'Name','NS');
% FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',[-6.668 0 6.668],'Name','Z');
% FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',[0.212 6.88 13.5],'Name','PS');
% FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',[6.77 13.4 20.1],'Name','PM');
% FIS_CELEC = addMF(FIS_CELEC,'EC','trimf',[13.33 20 26.68],'Name','PB');

FIS_CELEC = addOutput(FIS_CELEC,[-15 15],'Name','u');
FIS_CELEC = addMF(FIS_CELEC,'u','trimf', [-20 -15 -9.999],'Name','NB');
FIS_CELEC = addMF(FIS_CELEC,'u','trimf',[-15.2 -10.2 -5.16],'Name','NM');
FIS_CELEC = addMF(FIS_CELEC,'u','trimf', [-9.999 -5.001 0],'Name','NS');
FIS_CELEC = addMF(FIS_CELEC,'u','trimf', [-5.001 0 5.001],'Name','Zero');
FIS_CELEC = addMF(FIS_CELEC,'u','trimf', [0 5.001 9.999],'Name','PS');
FIS_CELEC = addMF(FIS_CELEC,'u','trimf', [5.001 9.999 15],'Name','PM');
FIS_CELEC = addMF(FIS_CELEC,'u','trimf', [9.999 15 20.01],'Name','PB');


ruleList = [1 1 1 1 1;   % Rule 1
               1 2 1 1 1;
               1 3 1 1 1;
               1 4 2 1 1;
               1 5 2 1 1;
               1 6 3 1 1;
               1 7 4 1 1;
          
               2 1 1 1 1;
               2 2 2 1 1;
               2 3 2 1 1;
               2 4 2 1 1;
               2 5 3 1 1;
               2 6 4 1 1;
               2 7 5 1 1;
               
               3 1 1 1 1;
               3 2 1 1 1;
               3 3 3 1 1;
               3 4 2 1 1;
               3 5 2 1 1;
               3 6 4 1 1;
               3 7 5 1 1;
               
               4 1 1 1 1;
               4 2 2 1 1;
               4 3 2 1 1;
               4 4 3 1 1;
               4 5 2 1 1;
               4 6 4 1 1;
               4 7 3 1 1;
               
               5 1 1 1 1;
               5 2 1 1 1;
               5 3 2 1 1;
               5 4 2 1 1;
               5 5 3 1 1;
               5 6 4 1 1;
               5 7 5 1 1;
               
               6 1 1 1 1;
               6 2 1 1 1;
               6 3 3 1 1;
               6 4 2 1 1;
               6 5 3 1 1;
               6 6 4 1 1;
               6 7 5 1 1;
               
               7 1 1 1 1;
               7 2 1 1 1;
               7 3 2 1 1;
               7 4 3 1 1;
               7 5 2 1 1;
               7 6 3 1 1;
               7 7 5 1 1;
               ];



a = addRule(FIS_CELEC,ruleList);
a1=setfis(a,'DefuzzMethod','centroid'); 

% figure(1); plotfis(a1);  
% figure(2);plotmf(a1,'input',1);
% figure(3);plotmf(a1,'input',2);
% figure(4);plotmf(a1,'output',1); 
% figure(5);gensurf(a1) 

ideal = csvread('idealdata.csv',0,0);
originaldata = csvread('original.csv',1,0);
sample = originaldata(:,1);
original = originaldata(:,2);
e = ideal - original;
% % % % 
output = evalfis([e,e],a1) ;
output = output + original;
% % % 
col={'time','value'};
% % % 
result_table=table(sample,output,'VariableNames',col);
writetable(result_table, 'fuzzy.csv');