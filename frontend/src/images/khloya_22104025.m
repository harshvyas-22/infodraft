disp('khloya,22104025')
s=tf('s')
sys=(s+7)/(s*(s+5)*(s+15)*(s+20))
rlocus(sys)
axis([-22 3 -15 20])
zeta = 0.7
wn = 1.8
sgrid(zeta,wn)
[k,pole]=rlocfind(sys)