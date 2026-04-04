---
title: "Brier Score"
date: 2020-06-23T00:00:00.000Z
slug: "Survival-Analysis-note-0"
summary: "Notes on the Brier Score, censoring-aware evaluation, and the integral Brier Score for survival analysis."
tags:
  - "Machine Learning Survival Analysis"
category: "Research"
legacyPath: "/2020/06/23/Survival-Analysis-note-0/"
legacyTopLevelPaths: []
legacyTagSlugs:
  - "Machine-Learning-Survival-Analysis"
---
<p>我的<a href="https://zhuanlan.zhihu.com/p/371061788/preview?comment=0&amp;catalog=0">知乎版本</a>, 貌似知乎的latex公式反馈更好</p>
<p>Brier Score (mean squared error) 感觉这个 跟L2 loss 很像。但是因为我最近在做比较多survival analysis，所以经常接触 brier score。所以看到很少有人整理这块，我先简单整理，以后会多次更新修改。<br>1 - Brier Score<br>Brier Score 最原始的公式: </p>
<p>$ BS = \frac{1}{N} \sum_{t=1}^N(\hat y_t - y_t)^2 $, </p>
<p>L2 loss 对比 </p>
<p>$ \text{L2 loss} = {\sum_{t=1}^N (y_t - \hat y_t)^2} $</p>
<p>N: 是总共检测的样本数目<br>y_hat: 是 probability of y, 也就是 预测的概率<br>y: 是 ground truth 也就是 真实的y<br>Brier Score 的出来的范围 是 [0,1] 之间，然后Brier Score 越小则模型准确率越高。<br>Code:</p>
<figure class="highlight python"><table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br></pre></td><td class="code"><pre><span class="line"><span class="keyword">import</span> numpy <span class="keyword">as</span> np</span><br><span class="line"><span class="keyword">from</span> sklearn.metrics <span class="keyword">import</span> brier_score_loss</span><br><span class="line">y_true = np.array([<span class="number">0</span>, <span class="number">0</span>, <span class="number">1</span>, <span class="number">1</span>, <span class="number">1</span>])</span><br><span class="line">y_prob = np.array([<span class="number">0.2</span>, <span class="number">0.1</span>, <span class="number">0.8</span>, <span class="number">0.9</span>, <span class="number">0.5</span>])</span><br><span class="line"></span><br><span class="line">brier_score_loss(y_true, y_prob) <span class="comment"># 0.07</span></span><br></pre></td></tr></tbody></table></figure>
<p>2 - Brier Score 在生存测试 (without censor) [1]<br>在生存测试中，我们预测的是每个独立的病人的生存概率。</p>
<p>添加图片注释，不超过 140 字（可选）<br>也就是在时间点T = t’，病人A的生存概率 S(t’, X_A).<br>那么在每个时间点T 的生存概率就可以与病人的真实生存情况得出 Brier Score 在时间点T = t.</p>
<p>$ \mathbb{1} = T_i &gt; t $</p>
<p>$ BS(t) = \frac{1}{N} \sum_{i=1}^{N} (\mathbb{1} - \hat S (t, \vec x_i))^2 $</p>
<p>$\mathbb{1}$：indicator function 也就是 $T_i &gt; t$ 就是1 不然就是0</p>
<p>$\vec x_i$ ：因为每个病人其实是feature vector</p>
<p>bench_mark: 当所有的 S(x) = 0.5, BS = 1/N (N x 0.5^2 ) = 0.25<br>3 - Brier Score 在生存测试 (with censor)<br>censor 就是删失病人。在某个时间点 Ti 之后，病人数据消失了，我们只知道病人在Ti 之前是活着的。<br>这个时候我们引入了一个新的概念IPCW<br>$\hat G(t) = \prod_j \frac{n_j - d^{\star}_j}{n_j}: j \in {V_j &lt; t} $ 用来转移censor 病人的weight 到 uncensor 到病人去评估准确度。</p>
<p>$n_j$: 所有 在 t 时有censor的可能性的 病人 </p>
<p>$d^{\star}_j$: 在 t 时censor 的病人<br>例子</p>
<table>
<thead>
<tr>
<th>PatientId</th>
<th>Time(t)</th>
<th>censor bit(δ)</th>
<th>\hat{G}(t)</th>
<th>Weight 1/(\hat{G}(t))</th>
<th>KM(t)</th>
</tr>
</thead>
<tbody>
<tr>
<td></td>
<td>0</td>
<td></td>
<td>1</td>
<td></td>
<td>1</td>
</tr>
<tr>
<td>S1</td>
<td>1</td>
<td>u</td>
<td></td>
<td>1</td>
<td>0.8</td>
</tr>
<tr>
<td>S2</td>
<td>2</td>
<td>c</td>
<td>3/4</td>
<td>0</td>
<td></td>
</tr>
<tr>
<td>S3</td>
<td>3</td>
<td>u</td>
<td></td>
<td>4/3</td>
<td>0.533</td>
</tr>
<tr>
<td>S4</td>
<td>4</td>
<td>c</td>
<td>3/4 x 1/2</td>
<td>0</td>
<td></td>
</tr>
<tr>
<td>S5</td>
<td>5</td>
<td>u</td>
<td></td>
<td>8/3</td>
<td>0</td>
</tr>
</tbody>
</table>
<p>这里有个很有意思的发现，组里一个phd 大佬点醒了我们<br>我们会发现在算S3 的 Brier Score 的时候 weight 是 4/3，是因为除了他本身的 1，还加了 S2的 1/3。而算S5的 Brier Score 的时候 weight 是 8/3，除了S5 的1 以外 还加了 S4 的1 以及 S3的 2/3，也就是说 S2 的weight 有1/3 给了 S3， 有2/3 给了S5.<br>当时疑惑了好久，然后后来他发现 并不是 S2的weight 1/3 给了S5 而是S2的weight uniform 给了后面所有的 S (S3, S4, S5 各有1/3)。然而 因为 S4 本身也是 删失的情况，所以S4 连带着 S2的1/3 一起给了S5 所以才导致 S5的weight 是8/3。<br>然后我们提出了几个疑问，<br>1：万一最后全是censor 删失病人怎么办，后面的删失病人 的weight 没办法transfer 到最后一个 uncensor 病人上。(后来我们查论文得知 最后一个病人一定是uncensor 病人)<br>2：会不会导致越往后的病人 weight 越重要，当censor 病人足够多的时候，最后一个病人的预测情况可以左右结果。(这个好像的确是一个问题 但不知道这个是好是坏)</p>
<p>在融入 $ \hat G(t) $ 之后, BS 可以更新为</p>
<p>$ BS(t) =  \frac{1}{N} \sum_{i = 1}^{N} \left( \frac{\left( 0 - \hat{S}(t, \vec{x}<em>i)\right)^2 \cdot \mathbb{1}</em>{T_i \leq t, \delta_i = 1}}{ \hat{G}(T_i^-)} + \frac{ \left( 1 - \hat{S}(t, \vec{x}<em>i)\right)^2 \cdot \mathbb{1}</em>{T_i &gt; t}}{ \hat{G}(t)} \right)  $</p>
<p>$ BS(t) = \frac{1}{N} \sum_{i = 1}^N \left{                           \begin{array}{lr}              \frac{0-\hat S(t|Z_i)^2}{\hat G(t_i)} &amp; \text{if } t_i \leq t, \delta_i = 1  \              \frac{(1 - \hat S(t|Z_i))^2}{\hat G(t} &amp; \text{if } t_i &gt; t  \             0 &amp; \text{ if } t_i = t, \delta_i = 0                 \end{array} \right.  $</p>
<p>4 - integral Brier Score [2]<br>因为 BS(t) 是只考虑在 时间点 t 的时候 BS 是多少，但是生存概率是一个 时间范围内，如果我们想知道整个时间段的生存概率是否正确，我们可以用IBS<br>当我们只考虑 uncensor 病人，也就是有event的病人：</p>
<p>$ IBS(\tau, V_U, \hat S(\cdot | \cdot)) = \frac{1}{\tau} \int_{0}^{\tau} BS_t (V_U, \hat S(t| \cdot)) dt $</p>
<p>如果我们要加上 censor 的病人，我们就要用我们之前的IPCW 的weight 了</p>
<p>$ IBS(\tau, V, \hat S(\cdot | \cdot)) = \frac{1}{\tau} \int_{0}^{\tau} \left( \frac{\left( 0 - \hat{S}(t, \vec{x}<em>i)\right)^2 \cdot \mathbb{1}</em>{T_i \leq t, \delta_i = 1}}{ \hat{G}(T_i^-)} + \frac{ \left( 1 - \hat{S}(t, \vec{x}<em>i)\right)^2 \cdot \mathbb{1}</em>{T_i &gt; t}}{ \hat{G}(t)} \right) dt $</p>
<p>Reference:<br>[1] Graf, Erika, Claudia Schmoor, Willi Sauerbrei, and Martin Schumacher. 1999. “Assessment and Comparison of Prognostic Classification Schemes for Survival Data.”Statistics in Medicine18 (17-18): 2529–45.<br>[2] Haider, H., Hoehn, B., Davis, S., &amp; Greiner, R. (2020). Effective ways to build and evaluate individual survival distributions.Journal of Machine Learning Research,21(85), 1-63.</p>
